'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { Toaster } from 'react-hot-toast'

export default function Home() {
  const router = useRouter()
  const { user } = useStore()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
    </div>
  )
} 