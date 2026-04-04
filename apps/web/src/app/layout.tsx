import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Earthify',
  description: 'Modular SaaS platform for hospitality businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
