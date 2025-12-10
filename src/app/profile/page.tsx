import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { updateProfile, updatePassword } from '../login/actions'
import { User } from '@supabase/supabase-js'

export default async function ProfilePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header user={user} />
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full flex-1">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Account Settings</h1>
                <p className="text-muted-foreground mb-8">Manage your profile and security preferences.</p>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left Col: Navigation/Sidebar (Optional, or just content) -> Let's do a single col or split similar to dashboard if needed. 
               For settings, a single centered column or 2-col (info + security) works well. 
               Let's stick to the 7/5 split for consistency? Or just a clean stack. 
               Plan said "Personal Info" and "Security Section". */}

                    <div className="lg:col-span-7 space-y-8">
                        {/* Personal Info Card */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-border">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                Personal Details
                            </h2>

                            <form action={updateProfile} className="space-y-6">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-20 h-20 rounded-full bg-[#FFFDF5] border-2 border-[#EBE5DA] flex items-center justify-center font-heading font-bold text-primary text-3xl shadow-sm">
                                        {(user.user_metadata.full_name || user.email || 'U')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Email Address</label>
                                        <div className="text-foreground font-medium bg-secondary/30 px-4 py-3 rounded-xl border border-border/50">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground" htmlFor="full_name">Full Name</label>
                                        <input
                                            name="full_name"
                                            defaultValue={user.user_metadata.full_name || ''}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="e.g. Jane Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground" htmlFor="role">Role / Title</label>
                                        <input
                                            name="role"
                                            defaultValue={user.user_metadata.role || ''}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="e.g. Product Lead"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground" htmlFor="team_size">Team Size</label>
                                    <select
                                        name="team_size"
                                        defaultValue={user.user_metadata.team_size || '1-5'}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                                    >
                                        <option value="1-5">1-5 people</option>
                                        <option value="6-10">6-10 people</option>
                                        <option value="11-25">11-25 people</option>
                                        <option value="26-50">26-50 people</option>
                                        <option value="50+">50+ people</option>
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                        Save Profile Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                        {/* Security Card */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-border">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                Security
                            </h2>
                            <form action={updatePassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground" htmlFor="password">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="••••••••"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground" htmlFor="confirm_password">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="••••••••"
                                        minLength={6}
                                        required
                                    />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="bg-white border-2 border-border text-foreground px-6 py-3 rounded-full font-bold hover:bg-slate-50 transition-all w-full">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
