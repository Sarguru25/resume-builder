'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/features/authSlice'

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  const logoutUser = () => {
    dispatch(logout())
    router.push('/')   // replace navigate('/')
  }

  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800">
        <Link href="/">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto cursor-pointer" />
        </Link>

        <div className="max-sm:hidden flex items-center gap-4">
          <p>Hi, {user?.name}</p>
          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
