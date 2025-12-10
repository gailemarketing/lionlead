
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Dashboard } from '@/components/Dashboard'
import journeyData from '@/data/journey.json'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let user = null
  let supabase = null

  try {
    // Move client creation INSIDE try-catch because it might crash if env vars are missing
    supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("Supabase Error (Likely missing Env Vars):", error)
    // Fallback: user remains null, site renders in "Logged Out" mode
  }

  // Handle redirect if needed (though middleware should handle this usually)
  // if (!user) {
  //   return redirect('/login') 
  // }

  let completedDays: number[] = []

  if (user && supabase) {
    // Fetch completed days
    const { data: progress } = await supabase
      .from('user_progress')
      .select('day')
      .eq('user_id', user.id)

    if (progress) {
      completedDays = progress.map(p => p.day)
    }
  }

  // Calculate current day (conceptually, the first uncompleted day, or last completed + 1)
  const lastCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0

  // Ensure current day doesn't exceed total days
  // If user completed everything, stay on last day or show a "Done" state? 
  // For now, let's max out at the last available day if everything is done.
  let currentDay = lastCompletedDay + 1
  if (currentDay > journeyData.length) {
    currentDay = journeyData.length
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />

      <main className="flex-1">
        {user ? (
          <div className="p-4 md:p-8 max-w-[1150px] mx-auto w-full">
            {/* 
             Note: We removed the "Logged in as..." header here because call-to-actions 
             and profile info are now better handled in the Dashboard or Header.
            */}

            <Dashboard
              journeyData={journeyData}
              currentDay={currentDay}
              completedDays={completedDays}
            />
          </div>
        ) : (
          <Hero />
        )}
      </main>

      <Footer />
    </div>
  )
}
