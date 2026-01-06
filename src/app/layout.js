'use client'
import './globals.css'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './AuthProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthProvider>
            <Toaster position="top-center" richColors />
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}
