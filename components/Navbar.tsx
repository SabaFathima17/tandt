'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'

interface NavbarProps {
  userName?: string
  avatarUrl?: string
}

export default function Navbar({ userName, avatarUrl }: NavbarProps) {
  const router = useRouter()

  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-[#0f172a]">
      {/* Logo */}
      <div
        className="cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        <span className="text-xl font-bold text-white">Train & Test</span>
        <span className="text-[#00b894] text-xl font-bold"> T&T</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/resume')}
          className="text-gray-400 hover:text-white text-sm transition hidden md:block"
        >
          Resume Generator
        </button>
        <button
          onClick={() => router.push('/portfolio')}
          className="text-gray-400 hover:text-white text-sm transition hidden md:block"
        >
          Portfolio
        </button>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-gray-300 text-sm hidden md:block">{userName}</span>
        <button
          onClick={signOut}
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}