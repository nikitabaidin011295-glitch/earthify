'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  tenant: {
    id: string
    name: string
    slug: string
    plan: string
    modulesEnabled: string[]
  }
}

const MODULES = [
  { key: 'core', label: 'Core', icon: '⚙️', desc: 'Базові налаштування' },
  { key: 'hotel', label: 'Готель', icon: '🏨', desc: 'PMS, кімнати, check-in' },
  { key: 'spa', label: 'СПА', icon: '💆', desc: 'Записи, майстри, послуги' },
  { key: 'salon', label: 'Салон', icon: '💇', desc: 'Краса, стиль, догляд' },
  { key: 'pool', label: 'Басейн', icon: '🏊', desc: 'Абонементи, сесії' },
  { key: 'restaurant', label: 'Ресторан', icon: '🍽️', desc: 'Меню, столики, замовлення' },
  { key: 'cafe', label: 'Кафе', icon: '☕', desc: 'Бар, напої, каса' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { window.location.href = '/login'; return }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { if (data.id) setUser(data); else window.location.href = '/login' })
      .catch(() => window.location.href = '/login')
      .finally(() => setLoading(false))
  }, [])

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#6b7280' }}>Завантаження...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!user) return null

  const activeModules = MODULES.filter(m => user.tenant.modulesEnabled.includes(m.key))

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box; }
        .module-card:hover { transform: translateY(-2px); border-color: #7c3aed !important; }
        .nav-link:hover { color: #a78bfa !important; }
        .logout-btn:hover { background: #1f1f35 !important; color: #f87171 !important; border-color: #f87171 !important; }
      `}</style>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #1f1f35', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#0d0d1aee', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌍</div>
            <span style={{ fontWeight: 700, fontSize: 18, background: 'linear-gradient(90deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earthify</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Дашборд', 'Гості', 'Бронювання', 'Аналітика'].map(item => (
              <a key={item} href="#" className="nav-link" style={{ color: item === 'Дашборд' ? '#a78bfa' : '#6b7280', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}>{item}</a>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 14, color: '#e5e7eb' }}>{user.name}</span>
          </div>
          <button onClick={logout} className="logout-btn" style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #1f1f35', borderRadius: 8, color: '#6b7280', cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}>
            Вийти
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 6 }}>
            Привіт, {user.name}! 👋
          </h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: 15 }}>
            {user.tenant.name} · {user.role} · Trial
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Модулів активно', value: activeModules.length, icon: '📦', color: '#7c3aed' },
            { label: 'Гостей', value: '0', icon: '👥', color: '#06b6d4' },
            { label: 'Бронювань', value: '0', icon: '📅', color: '#10b981' },
            { label: 'План', value: user.tenant.plan.toUpperCase(), icon: '⭐', color: '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#13131f', border: '1px solid #1f1f35', borderRadius: 16, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 24, opacity: 0.3 }}>{stat.icon}</div>
              <p style={{ color: '#6b7280', fontSize: 12, margin: 0, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Активні модулі</h2>
            <a href="/settings/modules" style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none' }}>Налаштувати →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {activeModules.map(mod => (
              <div key={mod.key} className="module-card" style={{ background: '#13131f', border: '1px solid #1f1f35', borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{mod.icon}</div>
                <p style={{ fontWeight: 600, margin: 0, marginBottom: 4, fontSize: 15 }}>{mod.label}</p>
                <p style={{ color: '#6b7280', margin: 0, fontSize: 13 }}>{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: '#13131f', border: '1px solid #1f1f35', borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, marginBottom: 16 }}>Швидкі дії</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['➕ Нове бронювання', '👤 Додати гостя', '📊 Аналітика', '⚙️ Налаштування'].map(action => (
              <button key={action} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #1f1f35', borderRadius: 10, color: '#e5e7eb', cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = '#7c3aed'; (e.target as HTMLButtonElement).style.color = '#a78bfa' }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#1f1f35'; (e.target as HTMLButtonElement).style.color = '#e5e7eb' }}>
                {action}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
