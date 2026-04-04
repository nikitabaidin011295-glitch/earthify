export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      background: '#0a0a0a',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍 Earthify</h1>
      <p style={{ fontSize: '1.2rem', color: '#888' }}>
        Modular SaaS platform for hospitality businesses
      </p>
      <a 
        href="/login"
        style={{
          marginTop: '2rem',
          padding: '12px 32px',
          background: '#22c55e',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1rem'
        }}
      >
        Увійти
      </a>
    </main>
  )
}
