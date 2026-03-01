// src/pages/HomePage.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { MOCK_HOSTELS, DESTINATIONS } from '../mockData.js'
import { IconSearch, IconHeart } from '../Icons.jsx'

export default function HomePage({ onOpenHostel }) {
  const [hostels, setHostels]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('All')
  const [favorites, setFavorites] = useState(new Set())

  useEffect(() => {
    loadHostels()
  }, [])

  async function loadHostels() {
    setLoading(true)
    try {
      // Try Supabase first
      const { data, error } = await supabase.from('hostels').select('*').order('rating', { ascending: false })
      if (error || !data?.length) throw new Error('use mock')
      setHostels(data)
    } catch {
      // Fall back to mock data (shows while Supabase isn't configured)
      setHostels(MOCK_HOSTELS)
    }
    setLoading(false)
  }

  const toggleFavorite = (e, id) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = hostels.filter(h => {
    const matchSearch = !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.country.toLowerCase().includes(search.toLowerCase())

    const matchFilter = filter === 'All' ||
      (filter === 'Europe'    && ['Portugal','France','Turkey','Italy','Spain','Germany'].includes(h.country)) ||
      (filter === 'Asia'      && ['Japan','Thailand','Vietnam','India'].includes(h.country)) ||
      (filter === 'Americas'  && ['Colombia','Mexico','Brazil','Peru'].includes(h.country)) ||
      (filter === 'Under €20' && h.price_per_night < 20)

    return matchSearch && matchFilter
  })

  return (
    <div className="page">
      {/* ── Navbar ── */}
      <header className="navbar">
        <span className="navbar-brand"><span>W</span>anderer</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="nav-icon-btn" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="hero animate-fade-up">
        <p className="hero-eyebrow">Curated Stays Worldwide</p>
        <h1>Where will you<br/><em>wander</em> next?</h1>
        <p className="hero-sub">Handpicked hostels for the curious traveler</p>
      </div>

      {/* ── Search ── */}
      <div className="search-wrap animate-fade-up animate-stagger-1">
        <div className="search-bar">
          <IconSearch />
          <input
            type="text"
            placeholder="Search by city, hostel name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: 'var(--sepia)', opacity: 0.5, fontSize: '1.1rem' }}>×</button>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="filter-scroll animate-fade-up animate-stagger-2">
        {DESTINATIONS.map(d => (
          <button
            key={d}
            className={`filter-pill ${filter === d ? 'active' : ''}`}
            onClick={() => setFilter(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* ── Hostel List ── */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">
            {filter === 'All' ? 'All Destinations' : filter}
          </h2>
          <span className="section-link">{filtered.length} stays</span>
        </div>

        {loading ? (
          <div>
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <h3>No hostels found</h3>
            <p>Try a different search or filter.</p>
          </div>
        ) : (
          <div className="hostel-grid">
            {filtered.map((h, i) => (
              <HostelCard
                key={h.id}
                hostel={h}
                delay={i}
                isFav={favorites.has(h.id)}
                onToggleFav={e => toggleFavorite(e, h.id)}
                onClick={() => onOpenHostel(h)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="ornament">✦ ✦ ✦</div>
      <div style={{ height: 8 }} />
    </div>
  )
}

function HostelCard({ hostel, delay, isFav, onToggleFav, onClick }) {
  const delayClass = `animate-stagger-${Math.min(delay + 1, 6)}`
  return (
    <div
      className={`hostel-card animate-fade-up ${delayClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="card-img-wrap">
        <img
          className="card-img"
          src={hostel.image_url}
          alt={hostel.name}
          loading="lazy"
        />
        {/* Rating badge */}
        <div className="card-badge">
          <span className="card-badge-star">★</span>
          {hostel.rating}
          <span style={{ opacity: 0.5 }}>({hostel.review_count})</span>
        </div>
        {/* Fav button */}
        <button
          onClick={onToggleFav}
          style={{
            position: 'absolute', top: 12, left: 12,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(250,247,242,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isFav ? '#8B3A2A' : 'var(--sepia)',
            backdropFilter: 'blur(4px)',
            transition: 'var(--transition)',
            fontSize: '0.9rem',
          }}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <IconHeart filled={isFav} />
        </button>
      </div>
      <div className="card-body">
        <p className="card-location">{hostel.city}, {hostel.country}</p>
        <h3 className="card-name">{hostel.name}</h3>
        <p className="card-desc">{hostel.description}</p>
        <div className="card-footer">
          <div className="card-price">
            €{hostel.price_per_night}<span>/ night</span>
          </div>
          <div className="card-amenities">
            {(hostel.amenities || []).slice(0,2).map(a => (
              <span key={a} className="amenity-tag">{a}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="hostel-card" style={{ marginBottom: 16 }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: '14px 16px 16px' }}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 14, marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 14, width: '80%' }} />
      </div>
    </div>
  )
}
