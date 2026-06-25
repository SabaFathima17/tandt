'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      // Insert user into users table on first login
      await supabase.from('users').upsert({
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url,
      }, { onConflict: 'id' })

      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Train & Test</h1>
        <div className="flex items-center gap-4">
          {user?.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-gray-300 text-sm">{user?.user_metadata?.full_name}</span>
          <button
            onClick={signOut}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-2">
          Hi {user?.user_metadata?.full_name?.split(' ')[0]}, ready to build something real today?
        </h2>
        <p className="text-gray-400 mb-10">Your projects will appear here once you start building.</p>

        <button
          onClick={() => router.push('/entry')}
          className="bg-[#00b894] hover:bg-[#00a381] text-white font-semibold px-8 py-4 rounded-lg text-lg transition"
        >
          Start New Project
        </button>

        {/* Projects section */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-6">My Projects</h3>
          <div className="border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">You haven't built anything yet.</p>
            <p className="text-gray-500 mt-2">Let's fix that.</p>
          </div>
        </div>
      </main>
    </div>
  )
}