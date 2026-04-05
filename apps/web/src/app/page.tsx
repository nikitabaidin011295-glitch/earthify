export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', maxWidth: '900px', margin: '0 auto' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2rem', borderBottom: '0.5px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px', fontWeight: 500 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" fill="#534AB7"/>
            <ellipse cx="14" cy="14" rx="13" ry="5.5" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
            <ellipse cx="14" cy="14" rx="5.5" ry="13" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
            <circle cx="14" cy="14" r="3" fill="#CECBF6" opacity="0.8"/>
          </svg>
          Earthify
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '14px', color: '#666' }}>
          <a href="#modules" style={{ color: '#666', textDecoration: 'none' }}>Модулі</a>
          <a href="#pricing" style={{ color: '#666', textDecoration: 'none' }}>Тарифи</a>
          <a href="#demo" style={{ color: '#666', textDecoration: 'none' }}>Демо</a>
        </div>
        <a href="/register" style={{ background: '#534AB7', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
          Спробувати →
        </a>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 3rem' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 500, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Earthify<br />
          <span style={{ color: '#534AB7' }}>Software as a Service</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#555', maxWidth: '540px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Earthify об&apos;єднує управління готелем, спа, салоном краси, рестораном, кафе та басейном в одній платформі. Вмикай тільки потрібні модулі — платиш за те, що використовуєш.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" style={{ background: '#534AB7', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', textDecoration: 'none', fontWeight: 500 }}>
            Почати безкоштовно
          </a>
          <a href="#demo" style={{ background: 'transparent', color: '#111', border: '0.5px solid #ccc', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', textDecoration: 'none' }}>
            Дивитись демо
          </a>
        </div>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '1rem' }}>
          14 днів безкоштовно · Без кредитної картки · Скасуй будь-коли
        </p>
      </section>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '0.5px solid #e5e5e5', borderBottom: '0.5px solid #e5e5e5' }}>
        {[
          { num: '6', label: 'бізнес-модулів' },
          { num: '$29', label: 'старт / місяць' },
          { num: '18+', label: 'авто-тригерів' },
          { num: '4', label: 'мови інтерфейсу' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '1.5rem 1rem', borderRight: i < 3 ? '0.5px solid #e5e5e5' : 'none' }}>
            <div style={{ fontSize: '26px', fontWeight: 500, color: '#534AB7' }}>{s.num}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* MODULES */}
      <section id="modules" style={{ padding: '3rem 2rem' }}>
        <div style={{ fontSize: '11px', color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 500 }}>Модулі</div>
        <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '0.6rem' }}>Вибери що потрібно твоєму бізнесу</h2>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '2rem', maxWidth: '480px', lineHeight: 1.6 }}>
          Кожен модуль незалежний. Вмикай і вимикай у налаштуваннях. Платиш тільки за активні.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {modules.map((mod, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '32px' }}>{mod.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{mod.name}</div>
              <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{mod.desc}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {mod.features.map((f, j) => (
                  <li key={j} style={{ fontSize: '11px', color: '#999', display: 'flex', gap: '5px' }}>
                    <span style={{ color: '#534AB7' }}>·</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section style={{ padding: '3rem 2rem', borderTop: '0.5px solid #e5e5e5' }}>
        <div style={{ fontSize: '11px', color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 500 }}>Переваги</div>
        <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '0.6rem' }}>Чому Earthify</h2>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '2rem', lineHeight: 1.6 }}>Єдина платформа замість 4–5 різних систем</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {advantages.map((a, i) => (
            <div key={i} style={{ background: '#f8f8f8', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                {a.icon}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{a.title}</div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '3rem 2rem', borderTop: '0.5px solid #e5e5e5' }}>
        <div style={{ fontSize: '11px', color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 500 }}>Тарифи</div>
        <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '0.6rem' }}>Прозора ціна. Жодних сюрпризів.</h2>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '2rem', lineHeight: 1.6 }}>Скасуй у будь-який момент. Без прихованих платежів.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ background: '#fff', border: plan.featured ? '2px solid #534AB7' : '0.5px solid #e5e5e5', borderRadius: '14px', padding: '1.5rem' }}>
              {plan.featured && (
                <div style={{ display: 'inline-block', background: '#EEEDFE', color: '#3C3489', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', marginBottom: '10px' }}>
                  Найпопулярніший
                </div>
              )}
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>{plan.name}</div>
              <div style={{ fontSize: '30px', fontWeight: 500, lineHeight: 1 }}>{plan.price}</div>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '1rem' }}>{plan.period}</div>
              <hr style={{ border: 'none', borderTop: '0.5px solid #e5e5e5', margin: '1rem 0' }} />
              {plan.features.map((f, j) => (
                <div key={j} style={{ fontSize: '12px', color: '#555', padding: '3px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: f.ok ? '#1D9E75' : '#ccc' }}>{f.ok ? '✓' : '—'}</span>
                  {f.label}
                </div>
              ))}
              <a
                href="/register"
                style={{
                  display: 'block', width: '100%', marginTop: '1.2rem', padding: '10px', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 500, textAlign: 'center', textDecoration: 'none', cursor: 'pointer',
                  background: plan.featured ? '#534AB7' : 'transparent',
                  color: plan.featured ? '#fff' : '#111',
                  border: plan.featured ? 'none' : '0.5px solid #ccc',
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#EEEDFE', borderRadius: '16px', margin: '0 2rem 3rem', padding: '3rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 500, marginBottom: '0.75rem', color: '#26215C' }}>
          Готовий вивести бізнес на новий рівень?
        </h2>
        <p style={{ fontSize: '15px', color: '#534AB7', marginBottom: '1.5rem' }}>
          14 днів безкоштовно. Кредитна картка не потрібна. Підключення за 5 хвилин.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" style={{ background: '#534AB7', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', textDecoration: 'none', fontWeight: 500 }}>
            Створити акаунт безкоштовно
          </a>
          <a href="#demo" style={{ background: 'transparent', color: '#534AB7', border: '0.5px solid #534AB7', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', textDecoration: 'none' }}>
            Замовити демо
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '0.5px solid #e5e5e5', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500 }}>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" fill="#534AB7"/>
            <ellipse cx="14" cy="14" rx="13" ry="5.5" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
            <ellipse cx="14" cy="14" rx="5.5" ry="13" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
          </svg>
          Earthify
        </div>
        <div style={{ fontSize: '12px', color: '#999' }}>© 2026 Earthify · UA · EN · PL · DE</div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', color: '#999' }}>
          <a href="/terms" style={{ color: '#999', textDecoration: 'none' }}>Умови</a>
          <a href="/privacy" style={{ color: '#999', textDecoration: 'none' }}>Конфіденційність</a>
          <a href="/support" style={{ color: '#999', textDecoration: 'none' }}>Підтримка</a>
        </div>
      </footer>

    </main>
  )
}

const modules = [
  {
    icon: '🏨',
    name: 'Готель / PMS',
    desc: 'Управління номерами, бронювання, channel manager',
    features: ['Інтерактивна карта поверхів', 'Booking.com, Airbnb, Expedia', 'Digital Key через QR / NFC', 'Pre check-in онлайн за 24 год'],
  },
  {
    icon: '💆',
    name: 'СПА / Wellness',
    desc: 'Процедури, кабінети, запис до майстра',
    features: ['Вибір майстра з рейтингом', 'Авторезервація кабінету', 'SMS/Viber нагадування за 2 год', 'Зарядка на номер готелю'],
  },
  {
    icon: '✂️',
    name: 'Салон краси',
    desc: 'Онлайн-запис, майстри, портфоліо',
    features: ['AI Waitlist — авто-пропозиція часу', 'Портфоліо майстра в картці', 'Облік матеріалів (фарба, гель)', 'Loyalty: кожен N-й візит — знижка'],
  },
  {
    icon: '🍽️',
    name: 'Ресторан',
    desc: 'Бронювання столиків, меню, кухня',
    features: ['Kitchen Display System (KDS)', 'QR-меню — замовлення без офіціанта', 'Split bill між гостями', 'Зарядка на номер готелю'],
  },
  {
    icon: '☕',
    name: 'Кафе / Бар',
    desc: 'Швидкі замовлення, каса, QR-меню',
    features: ['Інтерактивна карта залу', 'QR-меню на кожному столику', 'Офлайн-режим каси', 'Loyalty для постійних гостей'],
  },
  {
    icon: '🏊',
    name: 'Басейн / Фітнес',
    desc: 'Абонементи, слоти, QR-вхід',
    features: ['Разові сеанси + абонементи', 'QR-код замість фізичної картки', 'Резерв шафки онлайн', 'Лічильник відвідувань в додатку'],
  },
]

const advantages = [
  { icon: '👤', title: 'Єдиний профіль гостя', desc: 'Клієнт бронює готель, спа і ресторан в одному місці, накопичує loyalty-бали по всіх сервісах і отримує єдиний чек.' },
  { icon: '🔧', title: 'Модульність', desc: 'Платиш тільки за активні модулі. Непотрібний — вимикається в Settings одним кліком.' },
  { icon: '📶', title: 'Офлайн-режим', desc: 'Каса працює без інтернету. Дані синхронізуються автоматично при відновленні з\'єднання.' },
  { icon: '🏷️', title: 'Білий лейбл', desc: 'Твій бренд, твій клієнтський додаток. Гості бачать тільки твій логотип.' },
  { icon: '🤖', title: 'AI Асистент', desc: 'Smart Pricing динамічно змінює ціну. AI Waitlist пропонує вільний час автоматично.' },
  { icon: '🌍', title: 'Мультимова', desc: 'Інтерфейс українською, англійською, польською та німецькою без перезавантаження.' },
]

const plans = [
  {
    name: 'Starter', price: '$29', period: '/ місяць · 1 локація', featured: false, cta: 'Почати →',
    features: [
      { ok: true, label: '2 модулі на вибір' },
      { ok: true, label: 'До 3 співробітників' },
      { ok: true, label: 'Базовий POS' },
      { ok: true, label: 'Онлайн-бронювання' },
      { ok: false, label: 'White-label додаток' },
      { ok: false, label: 'Channel manager' },
    ],
  },
  {
    name: 'Growth', price: '$89', period: '/ місяць · 1 локація', featured: true, cta: 'Почати →',
    features: [
      { ok: true, label: 'Всі модулі' },
      { ok: true, label: 'До 15 співробітників' },
      { ok: true, label: 'Повний POS + офлайн' },
      { ok: true, label: 'White-label додаток' },
      { ok: true, label: 'Loyalty програма' },
      { ok: true, label: 'AI Waitlist + Channel manager' },
    ],
  },
  {
    name: 'Enterprise', price: '$199+', period: '/ місяць · необмежено локацій', featured: false, cta: 'Зв\'язатись →',
    features: [
      { ok: true, label: 'Всі модулі' },
      { ok: true, label: 'Необмежено співробітників' },
      { ok: true, label: 'Digital Key (NFC)' },
      { ok: true, label: 'API доступ + SSO / SAML' },
      { ok: true, label: 'SLA 99.9% + Status page' },
      { ok: true, label: 'Мультилокація' },
    ],
  },
]
