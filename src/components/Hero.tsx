'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { ShieldCheck, Zap, Users, ArrowRight } from 'lucide-react'
import { OnboardingModal } from './OnboardingModal'
import { LoginModal } from './LoginModal'
import { ForgotPasswordModal } from './ForgotPasswordModal'
import { Toast } from './Toast'

export function Hero() {
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    // Check for messages in URL
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const message = searchParams.get('message')
        const error = searchParams.get('error')

        if (message) {
            setToast({ message, type: 'success' })
            router.replace('/') // Clear URL
        }

        if (error) {
            setToast({ message: error, type: 'error' })
            router.replace('/')
        }
    }, [searchParams, router])

    return (
        <>
            <div
                id="hero-section"
                className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 lg:gap-24 relative overflow-hidden max-w-site mx-auto"
            >
                <div className="space-y-8 max-w-2xl relative z-10 animate-in slide-in-from-left-10 duration-700 fade-in">
                    <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                        ● For New Product & Tech Leaders
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight text-balance">
                        Elevate Your First <span className="relative inline-block text-primary">
                            30 Days
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span> as a Leader
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                        The AI onboarding coach that guides you through the transition from "doer" to "leader" —one focused day at a time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => setIsOnboardingOpen(true)}
                            className="h-16 rounded-full text-lg px-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20 font-bold flex items-center justify-center w-full sm:w-auto cursor-pointer"
                        >
                            Start your 30-day journey
                        </button>
                    </div>
                    <div className="pt-8 flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            <span>Psychologically Safe</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            <span>Action-Oriented</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span>Role-Play Labs</span>
                        </div>
                    </div>
                </div>

                <div className="relative animate-in slide-in-from-right-10 duration-700 fade-in delay-200">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-yellow-200 to-orange-100 rounded-[3rem] blur-2xl opacity-60 -z-10"></div>
                    <Image
                        src="/hero-image.png"
                        alt="Diverse team meeting"
                        width={600}
                        height={450}
                        className="rounded-[2.5rem] shadow-2xl w-full object-cover aspect-[4/3] border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500"
                    />
                    {/* Floating Cards */}
                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg max-w-xs border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-black">Today's Action</span>
                        </div>
                        <p className="text-sm text-muted-foreground">"Schedule a 15-min listening check-in..."</p>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <OnboardingModal
                isOpen={isOnboardingOpen}
                onClose={() => setIsOnboardingOpen(false)}
                onSwitchToLogin={() => {
                    setIsOnboardingOpen(false)
                    setIsLoginOpen(true)
                }}
            />

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToSignup={() => {
                    setIsLoginOpen(false)
                    setIsOnboardingOpen(true)
                }}
                onSwitchToForgotPassword={() => {
                    setIsLoginOpen(false)
                    setIsForgotPasswordOpen(true)
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
