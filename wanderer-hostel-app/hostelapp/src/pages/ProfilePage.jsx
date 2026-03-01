// src/pages/ProfilePage.jsx
import { IconGlobe, IconShield, IconHelp, IconSettings, IconCalendar, IconChevronRight } from '../Icons.jsx'

export default function ProfilePage() {
  const name    = 'Fellow Wanderer'
  const initials = 'FW'

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: IconCalendar, label: 'My Reservations',    sub: 'View and manage trips'    },
        { icon: IconShield,   label: 'Privacy & Security', sub: 'Manage your data'         },
        { icon: IconSettings, label: 'Preferences',        sub: 'Language, currency, etc.' },
      ]
    },
    {
      title: 'About Wanderer',
      items: [
        { icon: IconGlobe, label: 'Our Story',        sub: 'The wanderer\'s manifesto'  },
        { icon: IconHelp,  label: 'Help & Support',   sub: 'FAQs and contact us'        },
      ]
    }
  ]

  return (
    <div className="page">
      <header className="navbar">
        <span className="navbar-brand"><span>W</span>anderer</span>
      </header>

      {/* Profile header */}
      <div className="profile-header animate-fade-up">
        <div className="avatar">{initials}</div>
        <p className="profile-name">{name}</p>
        <p className="profile-sub">Wandering since 2024</p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 20 }}>
          {[
            { value: '0', label: 'Countries' },
            { value: '0', label: 'Stays'     },
            { value: '0', label: 'Reviews'   },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', color: 'var(--ink)' }}>{s.value}</p>
              <p style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.72rem', color: 'var(--sepia)', opacity: 0.6, letterSpacing: '0.06em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vintage tagline */}
      <div style={{ padding: '16px 20px', textAlign: 'center', borderBottom: '1px solid var(--parchment)' }}>
        <p style={{ fontFamily: 'var(--ff-display)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--sepia)', opacity: 0.65 }}>
          "Travel is the only thing you buy that makes you richer."
        </p>
      </div>

      {/* Menu sections */}
      {sections.map(section => (
        <div key={section.title} className="profile-section animate-fade-up animate-stagger-1">
          <h3>{section.title}</h3>
          {section.items.map(item => (
            <div key={item.label} className="profile-item" role="button" tabIndex={0}>
              <div className="profile-item-icon">
                <item.icon />
              </div>
              <div className="profile-item-text">
                <strong>{item.label}</strong>
                <small>{item.sub}</small>
              </div>
              <IconChevronRight />
            </div>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div style={{ padding: '16px 20px 8px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.72rem', color: 'var(--sepia)', opacity: 0.4 }}>
          Wanderer v1.0 · Made with ♥ for travelers
        </p>
      </div>
    </div>
  )
}
