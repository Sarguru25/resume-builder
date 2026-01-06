'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Loader from '@/app/components/Loader'

export default function AppLayout({ children }) {
  const { data: session, status } = useSession()

  // Loading state
  if (status === 'loading') {
    return <Loader />
  }

  // Not logged in → redirect to login page
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
    </div>
  )
}
