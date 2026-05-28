/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes('ВСТАВЬ_СЮДА')) {
  console.error("❌ Error: Missing or invalid DATABASE_URL.");
  console.error("Please run this script with your actual Supabase connection string:");
  console.error("DATABASE_URL=\"postgres://...\" node scripts/setup-db.js");
  process.exit(1);
}

const client = new Client({
  connectionString,
});

const sql = `
-- Create ENUMs
DO $$ BEGIN
  CREATE TYPE game_mode AS ENUM ('pass_and_play', 'ai', 'online');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('in_progress', 'completed', 'abandoned');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  elo_rating INTEGER DEFAULT 1200,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create MATCHES Table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode game_mode NOT NULL,
  status match_status DEFAULT 'in_progress',
  player1_id UUID REFERENCES public.profiles(id),
  player2_id UUID REFERENCES public.profiles(id),
  winner_id UUID REFERENCES public.profiles(id),
  moves JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Setup basic policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
  CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
  CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN OTHERS THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
  CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN OTHERS THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Matches are viewable by everyone." ON public.matches;
  CREATE POLICY "Matches are viewable by everyone." ON public.matches FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can create matches." ON public.matches;
  CREATE POLICY "Anyone can create matches." ON public.matches FOR INSERT WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Players can update their matches." ON public.matches;
  CREATE POLICY "Players can update their matches." ON public.matches FOR UPDATE USING (true);
EXCEPTION WHEN OTHERS THEN null; END $$;

-- Add matches to Realtime Publication
DO $$ BEGIN
  -- If publication exists, add table. If not, create it.
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
  
  ALTER PUBLICATION supabase_realtime ADD TABLE matches;
EXCEPTION 
  WHEN duplicate_object THEN null; 
  WHEN OTHERS THEN null;
END $$;
`;

async function setupDatabase() {
  try {
    console.log("🔄 Connecting to the database...");
    await client.connect();
    console.log("✅ Connected. Executing schema setup...");
    
    await client.query(sql);
    
    console.log("🚀 Setup complete! Tables, Enums, RLS, and Realtime are configured.");
  } catch (err) {
    console.error("❌ Error setting up database:", err);
  } finally {
    await client.end();
  }
}

setupDatabase();
