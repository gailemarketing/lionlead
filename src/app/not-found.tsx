import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900">
            <div className="w-full max-w-md space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Page Not Found
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    </p>
                </div>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    )
}
