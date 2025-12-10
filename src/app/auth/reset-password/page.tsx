
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { updatePassword } from '@/app/login/actions'

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-[420px] bg-white dark:bg-card p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
                <div className="text-center space-y-4 mb-8">
                    <Link href="/" className="inline-block p-3 bg-primary/10 rounded-full mb-2">
                        <Image src="/logo.png" alt="LionLead Logo" width={48} height={48} className="w-12 h-12 object-contain" />
                    </Link>
                    <h1 className="text-2xl font-heading font-bold tracking-tight text-balance">
                        Set New Password
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Please enter your new password below.
                    </p>
                </div>

                <form action={updatePassword} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="password" className="font-bold text-xs uppercase tracking-wide">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base transition-all"
                            placeholder="Min. 6 characters"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all text-base cursor-pointer shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Reset Password
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-foreground hover:underline">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
