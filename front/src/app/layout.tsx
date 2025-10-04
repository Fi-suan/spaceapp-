import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Data Pathways - NASA Space Apps 2024',
  description: 'Climate & Environmental Risk Platform for Agriculture, Insurance & Wildfire Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}