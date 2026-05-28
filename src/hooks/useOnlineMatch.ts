import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Player, GameMode } from './useConnectFour';

export interface OnlineMatch {
  id: string;
  mode: GameMode;
  status: 'in_progress' | 'completed' | 'abandoned';
  player1_id: string | null;
  player2_id: string | null;
  winner_id: string | null;
  moves: { player: Player; col: number; row: number }[];
}

export function useOnlineMatch(matchId: string | null) {
  const [match, setMatch] = useState<OnlineMatch | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState<boolean>(false);
  const [incomingTaunt, setIncomingTaunt] = useState<{ player: Player; emoji: string; id: number } | null>(null);
  const [incomingChat, setIncomingChat] = useState<{ sender: string; text: string; id: number } | null>(null);
  const [incomingMove, setIncomingMove] = useState<{ moves: { player: Player; col: number; row: number }[], status: string } | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // 1. Authenticate Anonymously
  useEffect(() => {
    async function initAuth() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) {
          setError('Failed to sign in anonymously: ' + signInError.message);
          return;
        }
        setUserId(signInData.user?.id || null);
      } else {
        setUserId(sessionData.session.user.id);
      }
    }
    initAuth();
  }, []);

  // 2. Fetch Match & Join Logic
  useEffect(() => {
    if (!matchId || !userId) return;

    async function fetchAndJoinMatch() {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (error) {
        setError('Match not found or error loading match.');
        return;
      }

      let currentMatch = data as OnlineMatch;

      // If player1 is me
      if (currentMatch.player1_id === userId) {
        setIsPlayer1(true);
      } 
      // If player2 is empty and I am not player 1, join!
      else if (!currentMatch.player2_id && currentMatch.player1_id !== userId) {
        const { data: updatedMatch, error: updateError } = await supabase
          .from('matches')
          .update({ player2_id: userId })
          .eq('id', matchId)
          .select()
          .single();

        if (updateError) {
          setError('Failed to join match.');
          return;
        }
        currentMatch = updatedMatch;
      }

      setMatch(currentMatch);
    }

    fetchAndJoinMatch();
  }, [matchId, userId]);

  // 3. Realtime Subscription & Broadcasts
  useEffect(() => {
    if (!matchId) return;

    console.log(`[Realtime] Initializing channel for match:${matchId}`);
    const channel = supabase
      .channel(`match:${matchId}`, {
        config: {
          broadcast: { self: false },
        },
      })
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` },
        (payload) => {
          console.log('[Realtime] Match state updated:', payload.new);
          setMatch(payload.new as OnlineMatch);
        }
      )
      .on(
        'broadcast',
        { event: 'taunt' },
        (payload) => {
          console.log('[Realtime] Taunt received:', payload.payload);
          setIncomingTaunt({
            player: payload.payload.player as Player,
            emoji: payload.payload.emoji as string,
            id: Date.now(),
          });
        }
      )
      .on(
        'broadcast',
        { event: 'chat-message' },
        (payload) => {
          console.log('[Realtime] Chat message received:', payload.payload);
          setIncomingChat({
            sender: payload.payload.sender as string,
            text: payload.payload.text as string,
            id: Date.now(),
          });
        }
      )
      .on(
        'broadcast',
        { event: 'game-move' },
        (payload) => {
          console.log('[Realtime] Game move received via broadcast:', payload.payload);
          setIncomingMove(payload.payload as any);
        }
      )
      .subscribe((status, err) => {
        console.log(`[Realtime] Channel subscription status: ${status}`);
        if (err) {
          console.error('[Realtime] Channel error:', err);
        }
      });

    channelRef.current = channel;

    return () => {
      console.log(`[Realtime] Removing channel for match:${matchId}`);
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [matchId]);

  const sendMove = useCallback(async (newMoves: { player: Player; col: number; row: number }[], newStatus: 'in_progress' | 'completed' = 'in_progress') => {
    if (!matchId) return;
    const { error } = await supabase
      .from('matches')
      .update({ moves: newMoves, status: newStatus })
      .eq('id', matchId);
    if (error) {
      console.error('[Realtime] Error saving move to DB:', error);
    }
  }, [matchId]);

  const broadcastMove = useCallback((moves: { player: Player; col: number; row: number }[], status: string) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'game-move',
        payload: { moves, status },
      });
    }
  }, []);

  const broadcastTaunt = useCallback((player: Player, emoji: string) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'taunt',
        payload: { player, emoji },
      });
    }
  }, []);

  const broadcastChat = useCallback((sender: string, text: string) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'chat-message',
        payload: { text, sender },
      });
    }
  }, []);

  return { match, userId, isPlayer1, error, sendMove, broadcastTaunt, incomingTaunt, broadcastChat, incomingChat, broadcastMove, incomingMove };
}

export async function createOnlineMatch(userId: string): Promise<string | null> {
  // Ensure profile exists first (since it's a foreign key)
  const { data: existingProfile, error: profileFetchError } = await supabase.from('profiles').select('*').eq('id', userId).single();
  
  if (!existingProfile || profileFetchError) {
    const { error: profileError } = await supabase.from('profiles').upsert(
      { 
        id: userId, 
        username: `Guest_${userId.substring(0, 5)}`,
        elo_rating: 1400,
        wins: 0,
        losses: 0,
        is_pro: false
      },
      { onConflict: 'id' }
    );
    if (profileError) {
      console.error("Error inserting profile:", profileError.message, profileError.details);
    }
  } else {
    // Fallback protection for new users whose rating, wins, and losses are NULL
    const needsUpdate = existingProfile.elo_rating === null || existingProfile.wins === null || existingProfile.losses === null;
    if (needsUpdate) {
      const { error: updateError } = await supabase.from('profiles').update({
        elo_rating: existingProfile.elo_rating || 1400,
        wins: existingProfile.wins || 0,
        losses: existingProfile.losses || 0
      }).eq('id', userId);
      if (updateError) {
        console.error("Error updating profile nulls:", updateError.message);
      }
    }
  }

  const { data, error } = await supabase
    .from('matches')
    .insert({
      mode: 'online',
      status: 'in_progress',
      player1_id: userId,
      moves: []
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error("Error creating match. Message:", error?.message, "Details:", error?.details, "Full Error:", JSON.stringify(error, null, 2));
    return null;
  }
  return data.id;
}
