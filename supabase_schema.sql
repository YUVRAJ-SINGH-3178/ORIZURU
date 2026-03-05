-- Run this entire script in your Supabase SQL Editor

-- 1. Create Profiles Table (to store preferences and display names)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Watchlist Table
CREATE TABLE public.watchlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    movie_id BIGINT NOT NULL,
    movie_data JSONB NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- 3. Create Watch History Table
CREATE TABLE public.watch_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    movie_id BIGINT NOT NULL,
    movie_data JSONB NOT NULL,
    watched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5. Create Security Policies for Watchlist
CREATE POLICY "Users can manage their own watchlist"
ON public.watchlist FOR ALL USING (auth.uid() = user_id);

-- 6. Create Security Policies for Watch History
CREATE POLICY "Users can manage their own watch history"
ON public.watch_history FOR ALL USING (auth.uid() = user_id);

-- 7. Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, preferences)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url', '{}'::jsonb);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
