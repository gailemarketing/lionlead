'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return encodedRedirect("error", "/login", "Could not authenticate user")
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const role = formData.get('role') as string
    const teamSize = formData.get('teamSize') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: role,
                team_size: teamSize,
            },
        },
    })

    if (error) {
        return encodedRedirect("error", "/login", error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email) {
        return encodedRedirect("error", "/", "Email is required")
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    })

    if (error) {
        return encodedRedirect("error", "/", error.message)
    }

    return encodedRedirect("success", "/", "Check your email for the reset link")
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const full_name = formData.get('full_name') as string
    const role = formData.get('role') as string
    const team_size = formData.get('team_size') as string

    const { error } = await supabase.auth.updateUser({
        data: {
            full_name,
            role,
            team_size,
        },
    })

    if (error) {
        return encodedRedirect('error', '/profile', error.message)
    }

    return encodedRedirect('success', '/profile', 'Profile updated successfully')
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (password !== confirmPassword) {
        return encodedRedirect('error', '/profile', 'Passwords do not match')
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        return encodedRedirect('error', '/profile', error.message)
    }

    return encodedRedirect('success', '/profile', 'Password updated successfully')
}

function encodedRedirect(type: string, path: string, message: string) {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`)
}
