'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#00b894] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">
          Page not found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-[#00b894] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00a381] transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}