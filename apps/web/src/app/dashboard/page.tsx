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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      window.location.href = '/login'
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.id) setUser(data)
        else window.location.href = '/login'
      })
      .catch(() => window.location.href = '/login')
      .finally(() => setLoading(false))
  }, [])

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif' }}>
      Завантаження...
    </div>
  )

  if (!user) return null

  const moduleIcons: Record<string, string> = {
    core: '⚙️',
    hotel: '🏨',
    spa: '💆',
    salon: '💇',
    pool: '🏊',
    restaurant: '🍽️',
    cafe: '☕',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #222', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.2rem' }}>🌍 Earthify</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#aaa', fontSize: '14px' }}>{user.name}</span>
          <button onClick={logout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#aaa', cursor: 'pointer', fontSize: '14px' }}>
            Вийти
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Привіт, {user.name}! 👋</h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>Ласкаво просимо до {user.tenant.name}</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'План', value: user.tenant.plan.toUpperCase() },
            { label: 'Роль', value: user.role },
            { label: 'Модулі', value: user.tenant.modulesEnabled.length.toString() },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
              <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Modules */}
        <h3 style={{ fontSize: '1rem', color: '#aaa', marginBottom: '16px' }}>Активні модулі</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {user.tenant.modulesEnabled.map(mod => (
            <div key={mod} style={{ background: '#111', border: '1px solid #22c55e33', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{moduleIcons[mod] || '📦'}</div>
              <p style={{ fontSize: '14px', color: '#aaa' }}>{mod}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
