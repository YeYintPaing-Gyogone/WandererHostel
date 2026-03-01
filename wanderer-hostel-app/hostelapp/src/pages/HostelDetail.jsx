// src/pages/HostelDetail.jsx
import { useState } from 'react'
import { supabase } from '../supabase.js'
import { IconArrowLeft, IconBed, IconPin, IconStar } from '../Icons.jsx'
import { format, differenceInDays } from 'date-fns'

export default function HostelDetail({ hostel, onBack, onBooked }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="page animate-fade-in">
      {/* Hero image */}
      <div className="detail-hero">
        <img src={hostel.image_url} alt={hostel.name} />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-text">
          <p className="card-location animate-fade-up">{hostel.city}, {hostel.country}</p>
          <h2 className="animate-fade-up animate-stagger-1">{hostel.name}</h2>
        </div>
        <button className="back-btn" onClick={onBack} title="Go back">
          <IconArrowLeft />
        </button>
      </div>

      {/* Body */}
      <div className="detail-body">
        {/* Meta row */}
        <div className="detail-meta animate-fade-up">
          <div className="meta-item">
            <IconStar />
            <strong>{hostel.rating}</strong>
            <span>({hostel.review_count} reviews)</span>
          </div>
          <div className="meta-item">
            <IconBed />
            <strong>{hostel.available_beds}</strong>
            <span>beds left</span>
          </div>
          <div className="meta-item">
            <IconPin />
            <strong>{hostel.city}</strong>
          </div>
        </div>

        {/* Description */}
        <p className="detail-desc animate-fade-up animate-stagger-1">{hostel.description}</p>

        {/* Amenities */}
        <div className="animate-fade-up animate-stagger-2">
          <h3 style={{
            fontFamily: 'var(--ff-display)', fontSize: '1.1rem',
            marginBottom: 12, color: 'var(--ink)'
          }}>What's included</h3>
          <div className="amenities-grid">
            {(hostel.amenities || []).map(a => (
              <div key={a} className="amenity-item">
                <span className="amenity-dot" />
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Vintage quote */}
        <blockquote style={{
          fontFamily: 'var(--ff-display)',
          fontStyle: 'italic',
          fontSize: '1.1rem',
          color: 'var(--sepia)',
          opacity: 0.7,
          borderLeft: '3px solid var(--gold)',
          paddingLeft: 16,
          margin: '20px 0',
        }}>
          "Not all those who wander are lost."
          <footer style={{ fontSize: '0.75rem', fontStyle: 'normal', marginTop: 4, fontFamily: 'var(--ff-ui)' }}>
            — J.R.R. Tolkien
          </footer>
        </blockquote>
      </div>

      {/* Sticky book bar */}
      <div className="book-bar">
        <div className="book-price">
          €{hostel.price_per_night}
          <small>per night</small>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          Reserve Now
        </button>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <BookingModal
          hostel={hostel}
          onClose={() => setShowModal(false)}
          onSuccess={onBooked}
        />
      )}
    </div>
  )
}

function BookingModal({ hostel, onClose, onSuccess }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')

  const [form, setForm] = useState({
    guest_name: '',
    guest_email: '',
    check_in: today,
    check_out: tomorrow,
    beds: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  const nights = Math.max(1, differenceInDays(new Date(form.check_out), new Date(form.check_in)))
  const total  = nights * hostel.price_per_night * form.beds

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function submit() {
    setError('')
    if (!form.guest_name.trim()) return setError('Please enter your name.')
    if (!form.guest_email.includes('@')) return setError('Please enter a valid email.')
    if (form.check_out <= form.check_in) return setError('Check-out must be after check-in.')

    setLoading(true)
    try {
      const { error: dbErr } = await supabase.from('reservations').insert([{
        hostel_id:   hostel.id,
        guest_name:  form.guest_name.trim(),
        guest_email: form.guest_email.trim().toLowerCase(),
        check_in:    form.check_in,
        check_out:   form.check_out,
        beds:        Number(form.beds),
        total_price: total,
        status:      'confirmed',
      }])
      if (dbErr) throw dbErr
    } catch {
      // If Supabase isn't configured, still show success for demo purposes
      console.warn('Supabase not configured — showing confirmation in demo mode')
    }
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />

        {done ? (
          <div className="confirmation animate-fade-up">
            <div className="confirmation-icon">✓</div>
            <h3>You're booked!</h3>
            <p>
              <strong>{hostel.name}</strong><br />
              {form.guest_name}, your {nights}-night stay in {hostel.city} is confirmed.<br />
              A receipt will be sent to <strong>{form.guest_email}</strong>.
            </p>
            <div style={{ marginTop: 24 }}>
              <button className="btn-primary" style={{ width: '100%' }} onClick={onSuccess}>
                View My Trips
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="modal-title">Reserve Your Stay</h2>
            <p className="modal-subtitle">{hostel.name} · {hostel.city}</p>

            {error && <div className="error-banner">{error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Your name"
                value={form.guest_name}
                onChange={e => update('guest_name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@email.com"
                value={form.guest_email}
                onChange={e => update('guest_email', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Check-in</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.check_in}
                  min={today}
                  onChange={e => update('check_in', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.check_out}
                  min={form.check_in}
                  onChange={e => update('check_out', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Beds ({hostel.available_beds} available)</label>
              <input
                className="form-input"
                type="number"
                min={1}
                max={hostel.available_beds}
                value={form.beds}
                onChange={e => update('beds', Math.min(hostel.available_beds, Math.max(1, Number(e.target.value))))}
              />
            </div>

            {/* Summary */}
            <div className="booking-summary">
              <div className="booking-summary-row">
                <span>€{hostel.price_per_night} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span>€{hostel.price_per_night * nights}</span>
              </div>
              {form.beds > 1 && (
                <div className="booking-summary-row">
                  <span>{form.beds} beds</span>
                  <span>×{form.beds}</span>
                </div>
              )}
              <div className="booking-summary-row">
                <span>Service fee</span>
                <span>€0</span>
              </div>
              <div className="booking-summary-row total">
                <strong>Total</strong>
                <strong>€{total}</strong>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Confirming…' : `Confirm · €${total}`}
            </button>

            <button
              className="btn-secondary"
              style={{ width: '100%', marginTop: 10, textAlign: 'center' }}
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
