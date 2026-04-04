'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessType: 'hotel',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Помилка реєстрації')
        return
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      window.location.href = '/dashboard'
    } catch {
      setError('Помилка з\'єднання з сервером')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: 'sans-serif',
      padding: '20px',
    }}>
      <div style={{
        background: '#111',
        border: '1px solid #222',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
      }}>
        <h1 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.5rem' }}>🌍 Earthify</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Створіть акаунт</p>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Ваше ім'я", name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Пароль', name: 'password', type: 'password' },
            { label: 'Назва бізнесу', name: 'businessName', type: 'text' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Тип бізнесу
            </label>
            <select
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="hotel">🏨 Готель</option>
              <option value="spa">💆 СПА</option>
              <option value="salon">💇 Салон краси</option>
              <option value="pool">🏊 Басейн</option>
              <option value="restaurant">🍽️ Ресторан</option>
              <option value="cafe">☕ Кафе</option>
            </select>
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#166534' : '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Реєстрація...' : 'Зареєструватись'}
          </button>
        </form>

        <p style={{ color: '#666', fontSize: '14px', marginTop: '24px', textAlign: 'center' }}>
          Вже є акаунт?{' '}
          <a href="/login" style={{ color: '#22c55e', textDecoration: 'none' }}>Увійти</a>
        </p>
      </div>
    </main>
  )
}
