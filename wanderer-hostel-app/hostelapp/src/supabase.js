// src/supabase.js
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO SET UP YOUR FREE DATABASE (Supabase):
//
// 1. Go to https://supabase.com and click "Start your project" (free)
// 2. Create a new project (pick any name, any region, set a password)
// 3. Once your project is ready, go to Settings → API
// 4. Copy your "Project URL" and "anon public" key
// 5. Replace the two placeholder values below
//
// THEN run this SQL in Supabase → SQL Editor to create your tables:
//
// CREATE TABLE hostels (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   name TEXT NOT NULL,
//   city TEXT NOT NULL,
//   country TEXT NOT NULL,
//   description TEXT,
//   price_per_night NUMERIC NOT NULL,
//   rating NUMERIC DEFAULT 4.5,
//   review_count INT DEFAULT 0,
//   image_url TEXT,
//   amenities TEXT[],
//   available_beds INT DEFAULT 10,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE reservations (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   hostel_id UUID REFERENCES hostels(id),
//   guest_name TEXT NOT NULL,
//   guest_email TEXT NOT NULL,
//   check_in DATE NOT NULL,
//   check_out DATE NOT NULL,
//   beds INT DEFAULT 1,
//   total_price NUMERIC,
//   status TEXT DEFAULT 'confirmed',
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// -- Insert sample hostels:
// INSERT INTO hostels (name, city, country, description, price_per_night, rating, review_count, image_url, amenities, available_beds) VALUES
// ('The Grand Nomad', 'Lisbon', 'Portugal', 'A beautifully restored 19th-century townhouse in the heart of Alfama. Stone arches, azulejo tiles, and the smell of fresh pastéis de nata greet you every morning.', 18, 4.9, 312, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', ARRAY['Free Breakfast', 'Rooftop Terrace', 'Bike Rental', 'Wine Tasting'], 12),
// ('Maison Bohème', 'Paris', 'France', 'Hidden in a cobblestone alley of Montmartre, this intimate hostel blends Haussmanian grandeur with bohemian warmth. Art on every wall. Jazz on Tuesday nights.', 32, 4.8, 187, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', ARRAY['City Views', 'Bar & Lounge', 'Art Gallery', 'Guided Tours'], 8),
// ('Casa Vieja', 'Cartagena', 'Colombia', 'Colonial-era courtyard hostel draped in bougainvillea. The hammock garden is legendary. Sunsets from the rooftop are not optional.', 14, 4.7, 428, 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800', ARRAY['Pool', 'Hammock Garden', 'Rooftop Bar', 'Salsa Classes'], 16),
// ('The Silk Road Inn', 'Istanbul', 'Turkey', 'Steps from the Grand Bazaar, this Ottoman-era han has been welcoming travelers since 1887. Stained glass, hand-woven carpets, and tea served all day.', 22, 4.8, 264, 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800', ARRAY['Hammam', 'Rooftop', 'Turkish Breakfast', 'Bazaar Tours'], 10),
// ('The Navigator', 'Porto', 'Portugal', 'A maritime-themed retreat in the Ribeira district. Original wood beams, river views, and a cellar stocked with local port wine.', 20, 4.6, 195, 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800', ARRAY['River View', 'Wine Cellar', 'Free Port Tasting', 'Library'], 9),
// ('Kyoto House', 'Kyoto', 'Japan', 'A lovingly restored machiya townhouse in Gion. Tatami rooms, a garden koi pond, and morning matcha ceremony included with every stay.', 45, 4.9, 512, 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800', ARRAY['Matcha Ceremony', 'Garden', 'Tatami Rooms', 'Zen Meditation'], 6);
//
// -- Allow public read/write (for demo purposes):
// ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;
// ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read hostels" ON hostels FOR SELECT USING (true);
// CREATE POLICY "Public insert reservations" ON reservations FOR INSERT WITH CHECK (true);
// CREATE POLICY "Public read reservations" ON reservations FOR SELECT USING (true);
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'YOUR_SUPABASE_URL'        // ← paste your URL here
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'  // ← paste your key here

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
