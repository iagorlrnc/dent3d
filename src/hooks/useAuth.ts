import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { authQueries } from '@/lib/queries'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authQueries.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = authQueries.onAuthStateChange(async (_event, s) => {
      setSession(s)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await authQueries.signIn(email, password)
    return error
  }

  const signOut = async () => {
    await authQueries.signOut()
  }

  return { session, loading, signIn, signOut, isAdmin: !!session }
}
