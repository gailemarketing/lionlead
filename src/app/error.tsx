'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-zinc-900">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong!</h2>
                <div className="text-sm text-red-500 mb-4">{error.message}</div>
                <button
                    onClick={() => reset()}
                    className="rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
