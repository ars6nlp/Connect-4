'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Player } from '@/app/useConnectFour';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: number;
  player: Player;
  text: string;
}

interface ChatBoxProps {
  incomingChat: ChatMessage | null;
  broadcastChat: (player: Player, text: string) => void;
  myPlayer: Player;
}

export function ChatBox({ incomingChat, broadcastChat, myPlayer }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (incomingChat) {
      setMessages(prev => [...prev, incomingChat]);
    }
  }, [incomingChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Broadcast message
    broadcastChat(myPlayer, input);
    
    // Show locally
    setMessages(prev => [...prev, { id: Date.now(), player: myPlayer, text: input }]);
    setInput('');
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-white/10 flex flex-col h-64 relative overflow-hidden mt-4">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      
      <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2 z-10 flex items-center justify-between">
        <span>Live Chat</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar z-10 text-sm">
        {messages.length === 0 ? (
          <div className="text-white/30 italic text-center mt-10">No messages yet. Say hi!</div>
        ) : (
          messages.map(msg => {
            const isMe = msg.player === myPlayer;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${isMe ? 'bg-blue-500/20 border border-blue-500/30 text-blue-100 rounded-br-sm' : 'bg-white/10 border border-white/10 text-white/90 rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="mt-3 relative z-10 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 text-white/90 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-blue-500 shadow-md active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
