import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MindGym',
  description: 'Mental Health for Job Seekers',
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