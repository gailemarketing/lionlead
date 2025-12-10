
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { LoginModal } from './LoginModal'
import { OnboardingModal } from './OnboardingModal'
import { ForgotPasswordModal } from './ForgotPasswordModal'
import { User } from '@supabase/supabase-js'

export function Header({ user }: { user: User | null }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

    // Handle client-side logout
    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.reload() // Refresh to clear server state
    }

    return (
        <>
            <header className="w-full bg-white border-b border-border/50 sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 py-2 lg:px-12 lg:py-4 max-w-[1150px] mx-auto w-full">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Image src="/logo.png" alt="LionLead Logo" width={40} height={40} className="w-9 h-9 object-contain" />
                        <span className="font-heading font-bold text-xl tracking-tight text-foreground">LionLead</span>
                    </Link>
                    <div id="header-right">
                        {user ? (
                            <Link href="/profile" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold text-foreground leading-tight">
                                        {user.user_metadata.full_name || user.email?.split('@')[0] || 'User'}
                                    </p>
                                    <p className="text-[10px] font-bold text-muted-foreground tracking-wide">
                                        {user.user_metadata.role || 'Leader'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#FFFDF5] border border-[#EBE5DA] flex items-center justify-center font-heading font-bold text-primary text-lg shadow-sm">
                                    {(user.user_metadata.full_name || user.email || 'U')[0].toUpperCase()}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleLogout()
                                    }}
                                    className="ml-2 p-2 text-muted-foreground hover:text-red-500 transition-colors z-10"
                                    title="Log out"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                </button>
                            </Link>
                        ) : (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                                Log in
                            </button>
                        )}
                    </div>
                </div>
            </header >

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToSignup={() => setIsOnboardingOpen(true)}
                onSwitchToForgotPassword={() => {
                    setIsLoginOpen(false)
                    setIsForgotPasswordOpen(true)
                }}
            />

            <OnboardingModal
                isOpen={isOnboardingOpen}
                onClose={() => setIsOnboardingOpen(false)}
                onSwitchToLogin={() => {
                    setIsOnboardingOpen(false)
                    setIsLoginOpen(true)
                }}
            />

            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
                onBackToLogin={() => {
                    setIsForgotPasswordOpen(false)
                    setIsLoginOpen(true)
                }}
            />
        </>
    )
}
