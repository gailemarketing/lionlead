
'use client'

import { useState } from 'react'
import { Zap, CheckCircle, Lock, MessageSquare, Map, ChevronLeft, ChevronRight } from 'lucide-react'
import { completeDay } from '@/app/actions'
import { Coach } from './Coach'

interface JourneyDay {
    day: number
    title: string
    theme: string
    insight: string
    action: string
    script: string
    reflection_question: string
}

interface DashboardProps {
    journeyData: JourneyDay[]
    currentDay: number
    completedDays: number[]
}

export function Dashboard({ journeyData, currentDay, completedDays }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'journey' | 'coach'>('journey')
    const [reflection, setReflection] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeDay, setActiveDay] = useState(currentDay)

    const currentContent = journeyData.find(d => d.day === activeDay) || journeyData[0]
    const isCompleted = completedDays.includes(activeDay)
    const completionPercentage = Math.round((completedDays.length / 30) * 100)

    async function handleComplete() {
        if (!reflection.trim()) {
            alert('Please enter your reflection first.')
            return
        }

        setIsSubmitting(true)
        try {
            await completeDay(activeDay, reflection)
            // Ideally use a toast here
            setReflection('')
        } catch (error) {
            console.error('Failed to save', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Top Toggle */}
            <div className="flex justify-center">
                <div className="bg-[#F0F0F0] p-1.5 rounded-full shadow-inner border border-border/50 inline-flex items-center gap-1">
                    <button
                        onClick={() => setActiveTab('journey')}
                        className={`px-8 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'journey'
                            ? 'bg-white shadow-sm text-foreground scale-100'
                            : 'text-muted-foreground hover:bg-white/50'
                            }`}
                    >
                        <Map className="w-4 h-4" />
                        Journey
                    </button>
                    <button
                        onClick={() => setActiveTab('coach')}
                        className={`px-8 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'coach'
                            ? 'bg-white shadow-sm text-foreground scale-100'
                            : 'text-muted-foreground hover:bg-white/50'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Coach
                    </button>
                </div>
            </div>

            {activeTab === 'coach' ? (
                <Coach />
            ) : (
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-foreground">Your 30-Day Journey</h1>
                            <p className="text-muted-foreground mt-1">Day {activeDay} of 30</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 bg-secondary/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#EBE5DA] transition-all duration-1000 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>

                    {/* Day Navigation */}
                    <div className="relative group">
                        <button
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-border p-2 rounded-full md:hidden"
                            onClick={() => document.getElementById('day-nav')?.scrollBy({ left: -100, behavior: 'smooth' })}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div id="day-nav" className="flex gap-3 overflow-x-auto py-4 no-scrollbar mask-fade items-center scroll-smooth">
                            {journeyData.map((day) => {
                                const isDayCompleted = completedDays.includes(day.day)
                                const isCurrent = day.day === activeDay
                                const isLocked = day.day > currentDay && !isDayCompleted

                                let bgClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                if (isDayCompleted) bgClass = "bg-[#EBE5DA] text-foreground font-bold"
                                // Force black background with !important, add z-index to ensure visibility
                                if (isCurrent) bgClass = "!bg-black !text-white !font-bold shadow-lg scale-110 ring-4 ring-white z-20"
                                // if (isLocked) bgClass = "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"

                                return (
                                    <button
                                        key={day.day}
                                        onClick={() => !isLocked && setActiveDay(day.day)}
                                        // disabled={isLocked}
                                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm transition-all duration-300 relative ${bgClass}`}
                                    >
                                        {isDayCompleted && !isCurrent ? <CheckCircle className="w-5 h-5" /> : day.day}
                                    </button>
                                )
                            })}
                        </div>
                        <button
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-border p-2 rounded-full md:hidden"
                            onClick={() => document.getElementById('day-nav')?.scrollBy({ left: 100, behavior: 'smooth' })}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Two Column Layout */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-border p-8 md:p-12 relative overflow-hidden">
                        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 relative z-10">

                            {/* Left Column: Content */}
                            <div className="space-y-8 lg:col-span-7">
                                <div>
                                    <div className="inline-block bg-[#EBE5DA] text-foreground px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                                        {currentContent.theme}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-balance mb-6">
                                        {currentContent.title}
                                    </h2>
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Insight</p>
                                        <p className="text-lg leading-relaxed text-muted-foreground">
                                            {currentContent.insight}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-[#FFFDF5] p-8 rounded-2xl border border-yellow-100">
                                        <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                            Today's Action
                                        </h4>
                                        <p className="text-lg font-medium text-foreground leading-relaxed">
                                            {currentContent.action}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Suggested Script</h4>
                                        <blockquote className="border-l-4 border-yellow-400 pl-6 py-2 italic text-xl font-serif text-foreground/80 leading-relaxed">
                                            "{currentContent.script}"
                                        </blockquote>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Interaction */}
                            <div className="lg:border-l lg:border-border/50 lg:pl-12 flex flex-col h-full lg:col-span-5 relative">
                                <span className="absolute -top-6 right-0 text-9xl font-bold text-slate-200 pointer-events-none select-none z-0 opacity-50">
                                    {activeDay.toString().padStart(2, '0')}
                                </span>

                                <div className="bg-white rounded-xl shadow-sm border border-border/50 flex-grow flex flex-col p-6 h-full">
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6">Daily Reflection</h4>

                                    <p className="text-sm text-muted-foreground italic mb-4">
                                        {currentContent.reflection_question}
                                    </p>

                                    <textarea
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                        className="w-full flex-grow min-h-[200px] p-4 rounded-xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/10 outline-none resize-none text-base leading-relaxed placeholder:text-muted-foreground/50 mb-4"
                                        placeholder="Write your thoughts here..."
                                    ></textarea>

                                    <div className="flex justify-end">
                                        <button className="text-xs font-bold text-muted-foreground hover:text-foreground hover:underline transition-all">
                                            Save Note
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button
                                        onClick={handleComplete}
                                        disabled={isSubmitting || !reflection.trim() || isCompleted}
                                        className="w-full h-14 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/20 text-lg hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {isCompleted ? 'Day Completed' : isSubmitting ? 'Saving...' : 'Mark Day Complete'}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
