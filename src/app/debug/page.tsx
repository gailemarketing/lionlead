export default function DebugPage() {
    return (
        <div className="p-10 bg-green-100 text-green-900 border-2 border-green-500 rounded m-10">
            <h1 className="text-2xl font-bold">Debug Page Works!</h1>
            <p className="mt-4">
                If you can see this page, your Vercel deployment is basically working.
            </p>
            <p>
                The issue might be specific to the Home page (Database connection, logic crash, etc).
            </p>
            <p className="mt-4 text-sm text-gray-600">
                Generated at: {new Date().toISOString()}
            </p>
        </div>
    )
}
