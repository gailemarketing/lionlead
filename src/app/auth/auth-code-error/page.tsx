import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900">
            <div className="w-full max-w-md space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Authentication Error
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        There was an error verifying your authentication code. This can happen if the link has expired or has already been used.
                    </p>
                </div>
                <div className="mt-8">
                    <Link
                        href="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
