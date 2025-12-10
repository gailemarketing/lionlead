
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-auto w-full max-w-site mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-4">
                <Link href="https://gaillereports.com/gaille-reports-security-policy-data-privacy/" target="_blank" className="hover:text-foreground transition-colors">
                    Policy
                </Link>
                <Link href="https://gaillereports.com/terms-of-service/" target="_blank" className="hover:text-foreground transition-colors">
                    Terms of service
                </Link>
            </div>
            <p>
                Copyright © 2025 <Link href="https://gaillereports.com/" target="_blank" className="font-bold hover:text-foreground transition-colors">Gaille Reports</Link> | Powered by Responsive Theme
            </p>
        </footer>
    )
}
