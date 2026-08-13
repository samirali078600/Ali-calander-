-- Ali Calendar Supabase & PostgreSQL Production Schema
-- Designed for enterprise scalability, user data separation, and verified factual records

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
    country TEXT DEFAULT 'IN',
    state_province TEXT DEFAULT 'Delhi',
    city TEXT DEFAULT 'New Delhi',
    first_day_of_week INT DEFAULT 1, -- 0 for Sunday, 1 for Monday
    date_format TEXT DEFAULT 'DD/MM/YYYY',
    time_format TEXT DEFAULT '12h',
    theme_preference TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. USER EVENTS TABLE (Private to user)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    all_day BOOLEAN DEFAULT false,
    location TEXT,
    category TEXT DEFAULT 'personal', -- 'personal', 'work', 'meeting', 'reminder', 'birthday', 'holiday', 'study', 'custom'
    color TEXT DEFAULT '#3b82f6',
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    reminder_minutes INT DEFAULT 15, -- minutes before event
    repeat_frequency TEXT DEFAULT 'none' CHECK (repeat_frequency IN ('none', 'daily', 'weekly', 'monthly', 'yearly', 'custom')),
    is_completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. USER EVENT REMINDERS
CREATE TABLE IF NOT EXISTS public.event_reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    notification_type TEXT DEFAULT 'browser' CHECK (notification_type IN ('browser', 'email', 'push')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. USER COUNTDOWN TIMERS
CREATE TABLE IF NOT EXISTS public.countdowns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT DEFAULT 'custom', -- 'exam', 'birthday', 'wedding', 'vacation', 'project', 'custom'
    color TEXT DEFAULT '#8b5cf6',
    icon TEXT DEFAULT 'clock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. VERIFIED SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.verified_sources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'government', 'un_agency', 'academic', 'astronomy_lab', 'encyclopedic'
    trust_score INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PUBLIC HOLIDAYS DATABASE (Official & Verified)
CREATE TABLE IF NOT EXISTS public.holidays (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    day_name TEXT,
    country_code TEXT DEFAULT 'IN',
    state_code TEXT, -- NULL for national, or state abbreviation
    holiday_type TEXT NOT NULL CHECK (holiday_type IN ('national', 'state', 'restricted', 'gazetted', 'international')),
    description TEXT,
    significance TEXT,
    source_id UUID REFERENCES public.verified_sources(id),
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PUBLIC FESTIVALS DATABASE
CREATE TABLE IF NOT EXISTS public.festivals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE,
    lunar_rule TEXT,
    religion TEXT NOT NULL CHECK (religion IN ('hindu', 'islamic', 'christian', 'sikh', 'jain', 'buddhist', 'cultural', 'national')),
    region TEXT,
    description TEXT NOT NULL,
    history TEXT,
    significance TEXT,
    rituals TEXT,
    source_url TEXT,
    source_name TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. HISTORICAL "ON THIS DAY" DATABASE
CREATE TABLE IF NOT EXISTS public.historical_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    day INT NOT NULL CHECK (day BETWEEN 1 AND 31),
    year INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('world', 'india', 'science', 'space', 'technology', 'culture', 'politics', 'sports')),
    source_name TEXT NOT NULL,
    source_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. FAMOUS BIRTHDAYS & REMEMBERING (DEATHS)
CREATE TABLE IF NOT EXISTS public.famous_personalities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    death_date DATE,
    profession TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('scientist', 'inventor', 'artist', 'leader', 'athlete', 'author', 'musician', 'entrepreneur')),
    country TEXT NOT NULL,
    short_bio TEXT NOT NULL,
    major_contribution TEXT NOT NULL,
    source_name TEXT,
    source_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. DAILY FACTS DATABASE
CREATE TABLE IF NOT EXISTS public.daily_facts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    day INT NOT NULL CHECK (day BETWEEN 1 AND 31),
    category TEXT NOT NULL CHECK (category IN ('science', 'space', 'technology', 'history', 'geography', 'india', 'world', 'human_body', 'animals', 'mathematics', 'psychology')),
    fact_text TEXT NOT NULL,
    explanation TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. INTERNATIONAL OBSERVANCES
CREATE TABLE IF NOT EXISTS public.international_observances (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    official_name TEXT NOT NULL,
    date DATE NOT NULL,
    month INT NOT NULL,
    day INT NOT NULL,
    organization TEXT NOT NULL, -- e.g., 'United Nations', 'WHO', 'UNESCO'
    category TEXT NOT NULL,
    purpose TEXT NOT NULL,
    source_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.famous_personalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.international_observances ENABLE ROW LEVEL SECURITY;

-- User Policies: Users can only see and modify their own private events
CREATE POLICY "Users can view their own events" ON public.events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON public.events FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage countdowns" ON public.countdowns FOR ALL USING (auth.uid() = user_id);

-- Public factual data is readable by all users (anonymous and authenticated)
CREATE POLICY "Public read on holidays" ON public.holidays FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public read on festivals" ON public.festivals FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public read on historical events" ON public.historical_events FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public read on famous personalities" ON public.famous_personalities FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public read on daily facts" ON public.daily_facts FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Public read on observances" ON public.international_observances FOR SELECT TO PUBLIC USING (true);
