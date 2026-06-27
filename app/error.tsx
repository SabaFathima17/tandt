'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  const router = useRouter()

  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-400 mb-8">
          We&apos;ve been notified and are working on a fix.
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