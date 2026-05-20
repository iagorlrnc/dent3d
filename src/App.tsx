import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PublicSite } from '@/pages/PublicSite'
import { AdminPanel } from '@/pages/AdminPanel'
import { LoginModal } from '@/components/public/LoginModal'

export default function App() {
  const { session, loading } = useAuth()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Listen to path changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (to: string) => {
    window.history.pushState({}, '', to)
    setCurrentPath(to)
  }

  const hostname = window.location.hostname
  const isAdminSubdomain = hostname.startsWith('admin.')

  // Helper redirects
  const redirectToAdminLogin = () => {
    const { protocol, host, hostname, port } = window.location
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      window.location.href = `${protocol}//admin.localhost:${port}/login`
    } else {
      if (!hostname.startsWith('admin.')) {
        window.location.href = `${protocol}//admin.${host}/login`
      } else {
        window.location.href = `${protocol}//${host}/login`
      }
    }
  }

  const redirectToPublicSite = () => {
    const { protocol, hostname, port } = window.location
    if (hostname === 'admin.localhost') {
      window.location.href = `${protocol}//localhost:${port}/`
    } else if (hostname.startsWith('admin.')) {
      const bareHostname = hostname.replace(/^admin\./, '')
      window.location.href = `${protocol}//${bareHostname}${port ? `:${port}` : ''}/`
    } else {
      window.history.pushState({}, '', '/')
      setCurrentPath('/')
    }
  }

  // Handle subdomain and path-based routing
  useEffect(() => {
    if (loading) return

    if (isAdminSubdomain) {
      if (session) {
        // Logged in: if on /login, redirect to /
        if (currentPath === '/login') {
          navigate('/')
        }
      } else {
        // Not logged in: if not on /login, redirect to /login
        if (currentPath !== '/login') {
          navigate('/login')
        }
      }
    } else {
      // If they are on the public site and access /login directly, redirect to admin subdomain login
      if (currentPath === '/login') {
        redirectToAdminLogin()
      }
    }
  }, [loading, session, isAdminSubdomain, currentPath])

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

  // Admin Subdomain Experience
  if (isAdminSubdomain) {
    if (session) {
      return <AdminPanel onExit={redirectToPublicSite} />
    } else {
      // Standalone Login Page on admin.domain.com/login
      return (
        <div className="min-h-screen bg-gradient-to-br from-cream via-ivory to-teal-light/15 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background Decorators matching admin style */}
          <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-light/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10000ms]" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-teal-light/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />

          {/* Centered standalone login card */}
          <div className="z-10 w-full max-w-sm">
            <LoginModal
              isPage
              onBackToSite={redirectToPublicSite}
              onSuccess={() => navigate('/')}
            />
          </div>
        </div>
      )
    }
  }

  // Public Subdomain Experience
  return (
    <PublicSite
      onAdminEnter={redirectToAdminLogin}
    />
  )
}
