// src/pages/ReservationsPage.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { IconCalendar } from '../Icons.jsx'
import { format } from 'date-fns'

// Demo reservations shown when Supabase isn't connected
const DEMO_RESERVATIONS = [
  {
    id: 'demo-1',
    guest_name: 'Demo Guest',
    guest_email: 'demo@example.com',
    check_in: '2026-03-15',
    check_out: '2026-03-18',
    beds: 1,
    total_price: 54,
    status: 'confirmed',
    hostel: { name: 'The Grand Nomad', city: 'Lisbon', country: 'Portugal' },
  },
  {
    id: 'demo-2',
    guest_name: 'Demo Guest',
    guest_email: 'demo@example.com',
    check_in: '2026-04-01',
    check_out: '2026-04-04',
    beds: 2,
    total_price: 192,
    status: 'confirmed',
    hostel: { name: 'Maison Bohème', city: 'Paris', country: 'France' },
  },
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [isDemo, setIsDemo]             = useState(false)

  useEffect(() => { loadReservations() }, [])

  async function loadReservations() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, hostel:hostels(name,city,country)')
        .order('created_at', { ascending: false })
      if (error || !data) throw error
      setReservations(data)
      setIsDemo(false)
    } catch {
      setReservations(DEMO_RESERVATIONS)
      setIsDemo(true)
    }
    setLoading(false)
  }

  const upcoming = reservations.filter(r => new Date(r.check_out) >= new Date())
  const past     = reservations.filter(r => new Date(r.check_out) <  new Date())

  return (
    <div className="page">
      <header className="navbar">
        <span className="navbar-brand"><span>W</span>anderer</span>
      </header>

      <div style={{ padding: '20px 20px 0' }}>
        <h2 className="animate-fade-up" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', marginBottom: 4 }}>
          My Trips
        </h2>
        <p className="animate-fade-up animate-stagger-1" style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.85rem', color: 'var(--sepia)', opacity: 0.7 }}>
          Your travel history & upcoming stays
        </p>
        {isDemo && (
          <div className="error-banner animate-fade-up animate-stagger-2" style={{ marginTop: 12 }}>
            📋 Showing demo data — connect Supabase to see real bookings
          </div>
        )}
      </div>

      <div className="section" style={{ paddingTop: 20 }}>
        {loading ? (
          <div className="spinner" />
        ) : reservations.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <IconCalendar />
            <h3>No trips yet</h3>
            <p>Discover a hostel and make your first reservation.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <p className="animate-fade-up" style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sepia)', opacity: 0.6, marginBottom: 10 }}>
                  Upcoming
                </p>
                {upcoming.map((r, i) => <ReservationCard key={r.id} res={r} delay={i} />)}
              </>
            )}

            {past.length > 0 && (
              <>
                <p className="animate-fade-up" style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sepia)', opacity: 0.6, margin: '20px 0 10px' }}>
                  Past Stays
                </p>
                {past.map((r, i) => <ReservationCard key={r.id} res={r} delay={i} past />)}
              </>
            )}
          </>
        )}
      </div>

      <div className="ornament">✦ ✦ ✦</div>
    </div>
  )
}

function ReservationCard({ res, delay, past }) {
  const hostel   = res.hostel || {}
  const nights   = Math.max(1, Math.ceil(
    (new Date(res.check_out) - new Date(res.check_in)) / 86400000
  ))

  const fmt = d => {
    try { return format(new Date(d), 'MMM d, yyyy') }
    catch { return d }
  }

  return (
    <div
      className={`reservation-card animate-fade-up animate-stagger-${Math.min(delay+1,6)}`}
      style={{ opacity: past ? 0.7 : 1 }}
    >
      <div className="res-header">
        <div>
          <p className="res-name">{hostel.name || 'Unknown Hostel'}</p>
          <p style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.72rem', color: 'var(--sepia)', opacity: 0.7, marginTop: 2 }}>
            {hostel.city}, {hostel.country}
          </p>
        </div>
        <span className="res-status" style={{ background: past ? 'rgba(92,74,42,0.1)' : 'rgba(74,94,74,0.12)', color: past ? 'var(--sepia)' : 'var(--sage)' }}>
          {past ? 'Completed' : res.status}
        </span>
      </div>
      <div className="res-detail">
        <span>📅 {fmt(res.check_in)} → {fmt(res.check_out)}</span>
        <span>🌙 {nights} night{nights > 1 ? 's' : ''}</span>
        <span>🛏 {res.beds} bed{res.beds > 1 ? 's' : ''}</span>
        {res.total_price && <strong>€{res.total_price} total</strong>}
      </div>
    </div>
  )
}
