
'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { login } from '@/app/login/actions'
import Link from 'next/link'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onSwitchToSignup: () => void
    onSwitchToForgotPassword: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup, onSwitchToForgotPassword }: LoginModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-white dark:bg-card w-full max-w-[420px] rounded-[2.5rem] shadow-2xl p-8 m-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar border border-white/20">
                <div className="mx-auto flex items-center justify-center mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Image src="/logo.png" alt="LionLead Logo" width={48} height={48} className="w-12 h-12 object-contain" />
                    </div>
                </div>
                <h2 className="text-2xl font-heading font-bold mb-6 text-center tracking-tight text-balance">Welcome Back, Leader</h2>

                <form action={login} className="space-y-3">
                    <div className="space-y-1">
                        <label htmlFor="login-email" className="font-bold text-xs uppercase tracking-wide">
                            Email
                        </label>
                        <input
                            type="email"
                            id="login-email"
                            name="email"
                            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base transition-all"
                            placeholder="you@company.com"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <input
                            type="password"
                            id="login-password"
                            name="password"
                            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base transition-all"
                            placeholder="••••••••"
                            required
                        />
                        <div className="text-right">
                            <button
                                type="button"
                                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => {
                                    onClose()
                                    onSwitchToForgotPassword()
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all text-base cursor-pointer shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Log In
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mt-4 text-center">
                    <p className="text-muted-foreground text-xs">
                        Don't have an account?{' '}
                        <button
                            onClick={() => {
                                onClose()
                                onSwitchToSignup()
                            }}
                            className="text-foreground font-bold hover:underline"
                        >
                            Start 30-day journey
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
