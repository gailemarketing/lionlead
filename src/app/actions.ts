
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function completeDay(day: number, reflection: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: user.id,
            day: day,
            reflection: reflection,
            completed_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id, day'
        })

    if (error) {
        console.error('Error saving progress:', error)
        throw new Error('Failed to save progress')
    }

    revalidatePath('/')
}
