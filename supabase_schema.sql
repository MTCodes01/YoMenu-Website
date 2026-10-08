-- Supabase Schema for YoMenu

-- 1. Create Tables
CREATE TABLE public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    logo TEXT,
    cover_image TEXT,
    rating NUMERIC(3, 1) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    location TEXT,
    address TEXT,
    open_until TEXT,
    currency TEXT DEFAULT 'INR',
    currency_symbol TEXT DEFAULT '₹',
    phone TEXT,
    instagram TEXT,
    whatsapp TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    is_veg BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    spicy_level INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    discount TEXT,
    code TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Storage Buckets for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-images', 'restaurant-images', true);

-- Enable RLS (Row Level Security) - By default we allow public read access for a menu app
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Allow public read access on menu_categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on offers" ON public.offers FOR SELECT USING (true);

-- Create Policies for storage
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images' OR bucket_id = 'restaurant-images');
-- Note: You should restrict INSERT/UPDATE/DELETE to authenticated admin users in production.
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images' OR bucket_id = 'restaurant-images');
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images' OR bucket_id = 'restaurant-images');
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images' OR bucket_id = 'restaurant-images');

-- Disable RLS for writes momentarily if you are not using Auth yet (For prototyping only)
-- Remove these if you implement Supabase Auth
CREATE POLICY "Allow public insert" ON public.restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.restaurants FOR UPDATE USING (true);
CREATE POLICY "Allow public insert" ON public.menu_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.menu_categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.menu_categories FOR DELETE USING (true);
CREATE POLICY "Allow public insert" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.menu_items FOR DELETE USING (true);
CREATE POLICY "Allow public insert" ON public.offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.offers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.offers FOR DELETE USING (true);
