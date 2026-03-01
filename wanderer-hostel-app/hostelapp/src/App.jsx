// src/App.jsx
import { useState } from 'react'
import HomePage from './pages/HomePage.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import ReservationsPage from './pages/ReservationsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import HostelDetail from './pages/HostelDetail.jsx'
import { IconHome, IconSearch, IconCalendar, IconUser } from './Icons.jsx'

export default function App() {
  const [tab, setTab]           = useState('home')   // home | explore | reservations | profile
  const [detailHostel, setDetailHostel] = useState(null) // hostel object when viewing detail
  const [toast, setToast]       = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const openDetail = (hostel) => setDetailHostel(hostel)
  const closeDetail = () => setDetailHostel(null)

  const tabs = [
    { id: 'home',         label: 'Discover', Icon: IconHome     },
    { id: 'explore',      label: 'Explore',  Icon: IconSearch   },
    { id: 'reservations', label: 'Trips',    Icon: IconCalendar },
    { id: 'profile',      label: 'Profile',  Icon: IconUser     },
  ]

  return (
    <div className="app-container">
      {/* Toast notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* Detail view overlays everything */}
      {detailHostel ? (
        <HostelDetail
          hostel={detailHostel}
          onBack={closeDetail}
          onBooked={() => {
            closeDetail()
            setTab('reservations')
            showToast('✓ Reservation confirmed!')
          }}
        />
      ) : (
        <>
          {tab === 'home'         && <HomePage onOpenHostel={openDetail} />}
          {tab === 'explore'      && <ExplorePage onOpenHostel={openDetail} />}
          {tab === 'reservations' && <ReservationsPage />}
          {tab === 'profile'      && <ProfilePage />}

          {/* Bottom Tab Bar */}
          <nav className="tab-bar">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`tab-btn ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
              >
                <Icon />
                {label}
                <div className="tab-dot" />
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  )
}
