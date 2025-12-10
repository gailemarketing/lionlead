
'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

interface ToastProps {
    message: string
    type: 'success' | 'error'
    onClose: () => void
    duration?: number
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300) // Wait for animation
        }, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <div
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                } ${type === 'success'
                    ? 'bg-white text-green-800 border-green-200 dark:bg-card dark:text-green-400 dark:border-green-900'
                    : 'bg-white text-red-800 border-red-200 dark:bg-card dark:text-red-400 dark:border-red-900'
                }`}
        >
            {type === 'success' ? (
                <CheckCircle2 className="w-6 h-6 shrink-0" />
            ) : (
                <AlertCircle className="w-6 h-6 shrink-0" />
            )}
            <p className="font-medium text-sm">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false)
                    setTimeout(onClose, 300)
                }}
                className="ml-2 hover:opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
