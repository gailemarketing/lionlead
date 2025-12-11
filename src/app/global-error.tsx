'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
                    <button
                        onClick={() => reset()}
                        className="rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
