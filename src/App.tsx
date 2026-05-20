import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PublicSite } from '@/pages/PublicSite'
import { AdminPanel } from '@/pages/AdminPanel'

export default function App() {
  const { session, loading } = useAuth()
  const [view, setView] = useState<'public' | 'admin'>('public')

  // If session exists on mount/refresh, go straight to admin
  useEffect(() => {
    if (!loading && session) {
      setView('admin')
    }
  }, [loading, session])

  // While checking session, show nothing (avoids flash)
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="font-display text-3xl font-light text-dark animate-pulse">
          Sorrir<span className="text-gold">.</span>Clinic
        </div>
      </div>
    )
  }

  if (view === 'admin' && session) {
    return <AdminPanel onExit={() => setView('public')} />
  }

  return (
    <PublicSite
      onAdminEnter={() => setView('admin')}
    />
  )
}
