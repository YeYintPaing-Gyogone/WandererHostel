// src/pages/ExplorePage.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { MOCK_HOSTELS } from '../mockData.js'
import { IconMap, IconSearch } from '../Icons.jsx'

const CITIES = [
  { name: 'Lisbon',     emoji: '🇵🇹', tagline: 'Fado & Sunshine',       img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&auto=format&fit=crop' },
  { name: 'Paris',      emoji: '🇫🇷', tagline: 'Grands Boulevards',      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop' },
  { name: 'Istanbul',   emoji: '🇹🇷', tagline: 'East Meets West',         img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&auto=format&fit=crop' },
  { name: 'Kyoto',      emoji: '🇯🇵', tagline: 'Temples & Tea',          img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&auto=format&fit=crop' },
  { name: 'Cartagena',  emoji: '🇨🇴', tagline: 'Color & History',        img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&auto=format&fit=crop' },
  { name: 'Porto',      emoji: '🇵🇹', tagline: 'Wine & Waterfront',      img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&auto=format&fit=crop' },
]

export default function ExplorePage({ onOpenHostel }) {
  const [hostels, setHostels] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from('hostels').select('*')
        if (error || !data?.length) throw new Error()
        setHostels(data)
      } catch { setHostels(MOCK_HOSTELS) }
    }
    load()
  }, [])

  const cityResults = selected
    ? hostels.filter(h => h.city.toLowerCase() === selected.toLowerCase())
    : []

  const searchResults = search
    ? hostels.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase()))
    : []

  return (
    <div className="page">
      <header className="navbar">
        <span className="navbar-brand"><span>W</span>anderer</span>
      </header>

      <div style={{ padding: '20px 20px 0' }}>
        <h2 className="animate-fade-up" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', marginBottom: 4 }}>
          Explore the World
        </h2>
        <p className="animate-fade-up animate-stagger-1" style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.85rem', color: 'var(--sepia)', opacity: 0.7, marginBottom: 16 }}>
          Find your next destination
        </p>
      </div>

      {/* Search */}
      <div className="search-wrap animate-fade-up animate-stagger-1">
        <div className="search-bar">
          <IconSearch />
          <input
            type="text"
            placeholder="Search any hostel or city…"
            value={search}
            onChange={e => { setSearch(e.target.value); setSelected(null) }}
          />
          {search && <button onClick={() => setSearch('')} style={{ color: 'var(--sepia)', opacity: 0.5 }}>×</button>}
        </div>
      </div>

      {/* Map placeholder */}
      {!search && !selected && (
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div className="explore-map-placeholder animate-fade-up animate-stagger-2">
            <IconMap />
            <p>Interactive map coming soon</p>
            <span style={{ fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: '0.78rem', color: 'var(--gold)', opacity: 0.7 }}>
              Browse cities below
            </span>
          </div>
        </div>
      )}

      {/* Search results */}
      {search && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Results for "{search}"</h2>
          </div>
          {searchResults.length === 0 ? (
            <div className="empty-state">
              <p>No results found.</p>
            </div>
          ) : searchResults.map((h, i) => (
            <MiniCard key={h.id} hostel={h} onClick={() => onOpenHostel(h)} delay={i} />
          ))}
        </div>
      )}

      {/* City grid */}
      {!search && !selected && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Popular Cities</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {CITIES.map((c, i) => {
              const count = hostels.filter(h => h.city === c.name).length
              return (
                <CityCard
                  key={c.name}
                  city={c}
                  count={count}
                  delay={i}
                  onClick={() => setSelected(c.name)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* City results */}
      {selected && !search && (
        <div className="section animate-fade-up">
          <div className="section-header">
            <h2 className="section-title">{selected}</h2>
            <button className="section-link" onClick={() => setSelected(null)}>← All cities</button>
          </div>
          {cityResults.length === 0 ? (
            <div className="empty-state">
              <p>No hostels listed yet in {selected}.</p>
            </div>
          ) : cityResults.map((h, i) => (
            <MiniCard key={h.id} hostel={h} onClick={() => onOpenHostel(h)} delay={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function CityCard({ city, count, delay, onClick }) {
  return (
    <div
      className={`hostel-card animate-fade-up animate-stagger-${Math.min(delay+1,6)}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
        <img src={city.img} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(26,18,8,0.65))' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10 }}>
          <p style={{ fontFamily: 'var(--ff-display)', color: 'white', fontSize: '1rem', fontWeight: 600 }}>{city.emoji} {city.name}</p>
          <p style={{ fontFamily: 'var(--ff-ui)', color: 'rgba(255,255,255,0.75)', fontSize: '0.65rem' }}>
            {count ? `${count} stay${count>1?'s':''}` : city.tagline}
          </p>
        </div>
      </div>
    </div>
  )
}

function MiniCard({ hostel, onClick, delay }) {
  return (
    <div
      className={`reservation-card animate-fade-up animate-stagger-${Math.min(delay+1,6)}`}
      onClick={onClick}
      style={{ cursor: 'pointer', borderLeft: '3px solid var(--gold)' }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img src={hostel.image_url} alt={hostel.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: 'var(--ff-display)', fontSize: '0.95rem', color: 'var(--ink)', marginBottom: 2 }}>{hostel.name}</p>
          <p style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.72rem', color: 'var(--sepia)', opacity: 0.7 }}>{hostel.city} · ★ {hostel.rating}</p>
          <p style={{ fontFamily: 'var(--ff-display)', fontSize: '0.9rem', color: 'var(--sepia)', marginTop: 2 }}>€{hostel.price_per_night}/night</p>
        </div>
      </div>
    </div>
  )
}
