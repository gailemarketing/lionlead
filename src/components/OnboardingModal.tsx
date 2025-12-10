
'use client'

import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { signup } from '@/app/login/actions'
import Link from 'next/link'

interface OnboardingModalProps {
    isOpen: boolean
    onClose: () => void
    onSwitchToLogin: () => void
}

export function OnboardingModal({ isOpen, onClose, onSwitchToLogin }: OnboardingModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-white dark:bg-card w-full max-w-[500px] rounded-[2.5rem] shadow-2xl p-8 m-4 animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto no-scrollbar border border-white/20">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-3">
                    {/* Icon */}
                    <div className="mx-auto flex items-center justify-center mb-2">
                        <Image src="/logo.png" alt="LionLead Logo" width={48} height={48} className="w-12 h-12 object-contain" />
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-heading font-bold text-foreground tracking-tight">
                            Let's personalize your journey
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                            Tell us a bit about your new role so we can tailor the coaching experience.
                        </p>
                    </div>
                </div>

                <form action={signup} className="space-y-3 mt-4">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-xs font-bold text-foreground block uppercase tracking-wide">
                            What should we call you?
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your first name"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-border/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base transition-all placeholder:text-muted-foreground/70"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-xs font-bold text-foreground block uppercase tracking-wide">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@company.com"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-border/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base transition-all placeholder:text-muted-foreground/70"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-xs font-bold text-foreground block uppercase tracking-wide">
                            Create Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Min. 6 characters"
                            required
                            minLength={6}
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-border/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base transition-all placeholder:text-muted-foreground/70"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label htmlFor="role" className="text-xs font-bold text-foreground block uppercase tracking-wide">
                                Role
                            </label>
                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-border/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Product Lead">Product Lead</option>
                                    <option value="Engineering Manager">Eng. Manager</option>
                                    <option value="Design Lead">Design Lead</option>
                                    <option value="Team Lead">Team Lead</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="teamSize" className="text-xs font-bold text-foreground block uppercase tracking-wide">
                                Team Size
                            </label>
                            <div className="relative">
                                <select
                                    id="teamSize"
                                    name="teamSize"
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-border/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base transition-all appearance-none cursor-pointer"
                                >
                                    <option value="1-5">1-5 people</option>
                                    <option value="6-10">6-10 people</option>
                                    <option value="11-20">11-20 people</option>
                                    <option value="20+">20+ people</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-14 text-lg rounded-full font-bold mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
                    >
                        Start My 30 Days
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-muted-foreground text-xs">
                        Already have an account?{' '}
                        <button
                            onClick={() => {
                                onClose()
                                onSwitchToLogin()
                            }}
                            className="text-foreground font-bold hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
