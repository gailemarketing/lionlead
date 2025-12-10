
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Send, Bot } from 'lucide-react'

export function Coach() {
    const [input, setInput] = useState('')

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-border overflow-hidden h-full min-h-[600px] flex flex-col mx-auto max-w-4xl animate-in fade-in duration-500">
            {/* Coach Header */}
            <div className="p-6 border-b border-border/50 flex items-center gap-4 bg-slate-50/50">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <Image
                            src="/coach-avatar.png"
                            alt="Coach"
                            width={48}
                            height={48}
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                    <h3 className="font-heading font-bold text-lg text-foreground">LionLead Coach</h3>
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                        Online & Ready to help
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto bg-slate-50/30">
                {/* Introduction Message */}
                <div className="flex gap-4 max-w-[90%]">
                    <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shrink-0 shadow-sm mt-1">
                        <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-[#EBE5DA] p-6 rounded-2xl rounded-tl-sm text-foreground/90 leading-relaxed shadow-sm">
                        <p>
                            Hi! I'm LionLead, your personal leadership coach. I can help you prepare for 1:1s,
                            draft difficult emails, or just vent about a tough day. What's on your mind?
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-border/50">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for advice, scripts, or feedback..."
                        className="w-full bg-slate-50 border border-border rounded-full py-4 pl-6 pr-14 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                        disabled={!input.trim()}
                        className="absolute right-2 top-2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
