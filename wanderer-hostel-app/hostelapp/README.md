# 🧭 Wanderer — Hostel Booking App

A vintage-luxe hostel reservation app built with **React + Vite** (frontend) and **Supabase** (free PostgreSQL database). Deploy for free on **Vercel**.

---

## ✨ Features
- Browse and search hostels by city, country, name
- Filter by region or price
- Full detail view with amenities
- Booking modal with date selection and cost summary
- Reservations history page
- Favorites / heart toggle
- Fully responsive mobile UI with bottom tab navigation
- Works offline in demo mode before Supabase is connected

---

## 🚀 Getting Started (Step by Step)

### Step 1 — Install Node.js
If you don't have it yet: download from https://nodejs.org (choose "LTS" version)

### Step 2 — Run the app locally
```bash
# Open a terminal in this folder, then:
npm install          # downloads all libraries (takes ~1 min first time)
npm run dev          # starts the app at http://localhost:5173
```
Open http://localhost:5173 in your browser. It will show demo data immediately!

---

## 🗄️ Step 3 — Connect Your Free Database (Supabase)

1. Go to **https://supabase.com** → click **"Start your project"** (free, no credit card)
2. Create a new project (any name, any password, any region)
3. Wait ~2 minutes for it to spin up
4. Go to **Settings → API** in your Supabase dashboard
5. Copy your **Project URL** and **anon public key**
6. Open `src/supabase.js` and replace:
   ```js
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'       // ← your URL
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY' // ← your key
   ```

7. In Supabase, go to **SQL Editor** → **New query** → paste the SQL from the top of `src/supabase.js` and click **Run**

That's it! Refresh the app and you'll see real data loading from your database.

---

## 🌍 Step 4 — Deploy Free to Vercel (Make it live!)

1. Create a free account at **https://vercel.com**
2. Install Vercel CLI: `npm install -g vercel`
3. In this folder, run: `vercel`
4. Follow the prompts (all defaults are fine)
5. Your app will be live at a URL like `wanderer.vercel.app` 🎉

Or use the web dashboard: push to GitHub, connect repo to Vercel — it auto-deploys on every commit.

---

## 📁 Project Structure

```
src/
├── main.jsx          ← App entry point
├── App.jsx           ← Root with tab navigation
├── index.css         ← All styles (design system)
├── supabase.js       ← Database connection + SQL setup
├── mockData.js       ← Demo data for offline/dev use
├── Icons.jsx         ← SVG icon components
└── pages/
    ├── HomePage.jsx        ← Discover feed with search & filters
    ├── ExplorePage.jsx     ← City browser & search
    ├── HostelDetail.jsx    ← Full hostel view + booking modal
    ├── ReservationsPage.jsx← My trips history
    └── ProfilePage.jsx     ← User profile
```

---

## 🎨 Design System

| Token            | Value         | Use                     |
|------------------|---------------|-------------------------|
| `--cream`        | #F5F0E8       | Background surfaces     |
| `--parchment`    | #EDE5D0       | Cards, inputs           |
| `--gold`         | #B8860B       | Accents, CTAs           |
| `--sepia`        | #5C4A2A       | Body text               |
| `--ink`          | #1A1208       | Headings                |
| `--ff-display`   | Playfair Display | Headings             |
| `--ff-body`      | Cormorant Garamond | Body text          |
| `--ff-ui`        | DM Sans       | Labels, buttons         |

---

## 🛠️ Extending the App

**Add more hostels**: Insert rows into the `hostels` table via Supabase's Table Editor (no SQL needed — it's like Google Sheets!)

**Add images**: Update `image_url` to any Unsplash photo URL

**Add user accounts**: Supabase has built-in auth — check their docs at https://supabase.com/docs/guides/auth

**Add real payments**: Integrate Stripe (free sandbox) — great next learning project!

---

## 🤔 Learning Notes

This project teaches you:
- **React state** (`useState`) — how data changes trigger UI updates
- **React effects** (`useEffect`) — running code when component loads
- **Async/await** — fetching data from a server
- **Component composition** — breaking UI into reusable pieces
- **CSS variables** — maintainable design systems
- **Supabase** — modern backend-as-a-service (PostgreSQL)

---

Built with ♥ for curious travelers and curious coders.
