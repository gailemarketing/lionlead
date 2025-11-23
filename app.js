// State
let state = {
    user: null, // { name, role, currentDay, completedDays: [] }
    messages: [
        {
            role: 'assistant',
            content: "Hi! I'm LionLead, your personal leadership coach. I can help you prepare for 1:1s, draft difficult emails, or just vent about a tough day. What's on your mind?"
        }
    ],
    isTyping: false
};

// Mock Data (Ported from mockData.ts)
const JOURNEY_DATA = [
    { day: 1, theme: "Identity Shift", title: "Embracing Your New Role", insight: "Your success now comes from your team's success.", action: "Schedule 1:1s with all direct reports.", script: "I'd love to hear your thoughts on what's going well...", reflection_question: "What's one thing you need to do differently?" },
    { day: 2, theme: "Identity Shift", title: "Active Listening", insight: "Great leaders listen more than they talk.", action: "Practice active listening in your next meeting.", script: "Thank you for sharing that. I appreciate your honesty...", reflection_question: "What did you learn by listening?" },
    // ... (We will load the rest dynamically or hardcode a few for demo)
];

// Init
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Check LocalStorage
    const savedUser = localStorage.getItem('lionlead_user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        renderDashboard();
    } else {
        renderHome();
    }
});

// --- Views ---

function renderHome() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div class="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <span class="text-5xl">🦁</span>
            </div>
            
            <div class="space-y-4 max-w-2xl">
                <h1 class="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground">
                    LionLead
                </h1>
                <p class="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                    Your AI-powered companion for the first 30 days of leadership.
                    <br/>
                    <span class="text-primary font-bold">Build habits. Build trust. Build your team.</span>
                </p>
            </div>

            <button onclick="showOnboarding()" class="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,200,0,0.5)]">
                <span class="mr-2 text-lg font-bold">Start My Journey</span>
                <i data-lucide="arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1"></i>
            </button>
        </div>

        <!-- Onboarding Modal -->
        <div id="onboarding-modal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
            <div class="bg-card w-full max-w-lg rounded-[2rem] shadow-2xl p-8 animate-in slide-in-from-bottom-10 duration-300">
                <div class="text-center space-y-4 mb-8">
                    <div class="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                        <span class="text-3xl">👋</span>
                    </div>
                    <h2 class="text-3xl font-heading font-bold">Let's personalize your journey</h2>
                    <p class="text-lg text-muted-foreground">Tell us a bit about your new role.</p>
                </div>

                <form onsubmit="handleOnboardingSubmit(event)" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-base font-semibold">What should we call you?</label>
                        <input type="text" name="name" required class="w-full h-12 px-4 rounded-xl bg-muted/30 border border-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Your first name">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-base font-semibold">New Role</label>
                            <select name="role" class="w-full h-12 px-4 rounded-xl bg-muted/30 border border-muted outline-none">
                                <option>Product Lead</option>
                                <option>Engineering Manager</option>
                                <option>Team Lead</option>
                                <option>Design Lead</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-base font-semibold">Team Size</label>
                            <select name="teamSize" class="w-full h-12 px-4 rounded-xl bg-muted/30 border border-muted outline-none">
                                <option>1-5 people</option>
                                <option>6-10 people</option>
                                <option>11-20 people</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-lg">
                        Start My 30 Days
                    </button>
                </form>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function showOnboarding() {
    document.getElementById('onboarding-modal').classList.remove('hidden');
}

function handleOnboardingSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    state.user = {
        name: formData.get('name'),
        role: formData.get('role'),
        currentDay: 1,
        completedDays: [],
        reflections: {}
    };

    localStorage.setItem('lionlead_user', JSON.stringify(state.user));
    renderDashboard();
}

function renderDashboard() {
    const app = document.getElementById('app');
    const currentContent = JOURNEY_DATA.find(d => d.day === state.user.currentDay) || JOURNEY_DATA[0];
    const progress = Math.round((state.user.completedDays.length / 30) * 100);

    app.innerHTML = `
        <div class="space-y-8 pb-12 animate-in fade-in duration-500">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-3xl font-heading font-bold">Your 30-Day Journey</h2>
                    <p class="text-muted-foreground">Day ${state.user.currentDay} of 30</p>
                </div>
                <div class="text-right">
                    <span class="text-2xl font-bold text-primary">${progress}%</span>
                </div>
            </div>
            <div class="h-4 w-full bg-secondary rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-1000" style="width: ${progress}%"></div>
            </div>

            <!-- Day Nav -->
            <div class="flex gap-4 overflow-x-auto py-4 no-scrollbar mask-fade">
                ${renderDayNav()}
            </div>

            <!-- Main Content Card -->
            <div class="bg-card rounded-[2rem] shadow-xl overflow-hidden border-none">
                <div class="h-2 bg-gradient-to-r from-primary to-orange-400 w-full"></div>
                <div class="p-8 grid md:grid-cols-5 gap-8">
                    
                    <!-- Left: Content -->
                    <div class="md:col-span-3 space-y-8">
                        <div>
                            <span class="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">${currentContent.theme}</span>
                            <h3 class="text-4xl font-heading font-bold mt-4 leading-tight">${currentContent.title}</h3>
                        </div>

                        <section>
                            <h4 class="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Insight</h4>
                            <p class="text-lg font-medium leading-relaxed">${currentContent.insight}</p>
                        </section>

                        <section class="bg-secondary/30 p-6 rounded-2xl border border-secondary/50">
                            <h4 class="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                                <i data-lucide="zap" class="w-4 h-4"></i> Today's Action
                            </h4>
                            <p class="text-lg">${currentContent.action}</p>
                        </section>

                        <section>
                            <h4 class="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Suggested Script</h4>
                            <blockquote class="border-l-4 border-primary pl-4 py-2 italic text-xl font-serif text-foreground/80 bg-muted/20 rounded-r-lg">
                                "${currentContent.script}"
                            </blockquote>
                        </section>
                    </div>

                    <!-- Right: Reflection & Coach -->
                    <div class="md:col-span-2 space-y-6 flex flex-col">
                        
                        <!-- Reflection Box -->
                        <div class="bg-muted/30 p-6 rounded-2xl border border-border flex-grow">
                            <h4 class="text-sm font-bold uppercase tracking-wider mb-4">Daily Reflection</h4>
                            <p class="text-sm text-muted-foreground mb-4 italic">${currentContent.reflection_question}</p>
                            <textarea id="reflection-input" class="w-full h-32 bg-background rounded-xl p-4 border-none resize-none focus:ring-1 focus:ring-primary" placeholder="Write your thoughts...">${state.user.reflections[state.user.currentDay] || ''}</textarea>
                            <div class="mt-4 flex justify-end">
                                <button onclick="saveReflection()" class="text-sm text-muted-foreground hover:text-primary font-medium">Save Note</button>
                            </div>
                        </div>

                        <!-- Complete Button -->
                        <button onclick="completeDay()" class="w-full h-14 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-[1.02] ${state.user.completedDays.includes(state.user.currentDay) ? 'bg-green-500 text-white cursor-default' : 'bg-primary text-primary-foreground hover:bg-primary/90'}">
                            ${state.user.completedDays.includes(state.user.currentDay) ? '✓ Completed' : 'Mark Day Complete'}
                        </button>

                    </div>
                </div>
            </div>

            <!-- AI Coach Section -->
            <div class="bg-card rounded-[2rem] shadow-xl overflow-hidden border border-border/50 h-[600px] flex flex-col">
                <div class="p-6 border-b border-border flex items-center gap-4 bg-muted/30">
                    <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white shadow-sm">
                        <span class="text-2xl">🦁</span>
                    </div>
                    <div>
                        <h3 class="font-heading font-bold text-lg">LionLead Coach</h3>
                        <div class="flex items-center gap-2 text-xs text-muted-foreground">
                            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online & Ready to help
                        </div>
                    </div>
                </div>

                <div id="chat-messages" class="flex-1 p-6 overflow-y-auto space-y-6">
                    ${renderMessages()}
                </div>

                <div class="p-4 bg-muted/30 border-t border-border">
                    <form onsubmit="sendMessage(event)" class="relative flex items-center">
                        <input id="chat-input" type="text" class="w-full h-14 pl-6 pr-14 rounded-full border-2 border-border focus:border-primary bg-background text-lg shadow-sm outline-none" placeholder="Ask for advice, scripts, or feedback...">
                        <button type="submit" class="absolute right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                            <i data-lucide="send" class="w-5 h-5"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
    scrollToBottom();
}

function renderDayNav() {
    let html = '';
    for (let i = 1; i <= 30; i++) {
        const isCompleted = state.user.completedDays.includes(i);
        const isCurrent = i === state.user.currentDay;
        const isLocked = i > state.user.currentDay;

        let classes = "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ";
        if (isCurrent) classes += "bg-foreground text-background scale-110 shadow-lg ring-2 ring-primary ring-offset-2";
        else if (isCompleted) classes += "bg-primary text-primary-foreground hover:bg-primary/90";
        else if (isLocked) classes += "bg-muted text-muted-foreground opacity-50 cursor-not-allowed";
        else classes += "bg-card text-foreground hover:bg-secondary border border-border";

        html += `<button ${isLocked ? 'disabled' : `onclick="switchDay(${i})"`} class="${classes}">${isCompleted && !isCurrent ? '<i data-lucide="check" class="w-5 h-5"></i>' : i}</button>`;
    }
    return html;
}

function renderMessages() {
    return state.messages.map(msg => `
        <div class="flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}">
                <i data-lucide="${msg.role === 'user' ? 'user' : 'bot'}" class="w-5 h-5 text-foreground"></i>
            </div>
            <div class="max-w-[80%] p-4 rounded-2xl text-base leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md' : 'bg-secondary text-secondary-foreground rounded-tl-none'}">
                ${msg.content}
            </div>
        </div>
    `).join('');
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
}

function switchDay(day) {
    // Only allow switching if day <= currentDay (logic simplified for demo)
    if (day <= state.user.currentDay) {
        // Update UI state for view only (in a real app we'd separate view state from user progress state)
        // For now, we just re-render dashboard. 
        // Note: This simple implementation assumes currentDay is the one being viewed.
        // To view past days properly, we'd need a separate 'viewingDay' state.
        // Let's just alert for now to keep it simple or implement viewingDay if needed.
        alert("Viewing past days is coming soon! Focus on Day " + state.user.currentDay);
    }
}

function completeDay() {
    if (!state.user.completedDays.includes(state.user.currentDay)) {
        state.user.completedDays.push(state.user.currentDay);
        if (state.user.currentDay < 30) {
            state.user.currentDay++;
        }
        localStorage.setItem('lionlead_user', JSON.stringify(state.user));
        renderDashboard();

        // Confetti effect could go here
    }
}

function saveReflection() {
    const text = document.getElementById('reflection-input').value;
    state.user.reflections[state.user.currentDay] = text;
    localStorage.setItem('lionlead_user', JSON.stringify(state.user));
    alert("Reflection saved!");
}

async function sendMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    // Add User Message
    state.messages.push({ role: 'user', content: text });
    input.value = '';

    // Re-render messages only (optimization)
    document.getElementById('chat-messages').innerHTML = renderMessages();
    lucide.createIcons();
    scrollToBottom();

    // Show Typing Indicator
    const messagesContainer = document.getElementById('chat-messages');
    const typingId = 'typing-' + Date.now();
    messagesContainer.insertAdjacentHTML('beforeend', `
        <div id="${typingId}" class="flex gap-3 animate-pulse">
            <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><i data-lucide="bot" class="w-5 h-5"></i></div>
            <div class="bg-secondary p-4 rounded-2xl rounded-tl-none text-sm text-muted-foreground">Thinking...</div>
        </div>
    `);
    lucide.createIcons();
    scrollToBottom();

    try {
        const response = await fetch('/api/coach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                userId: state.user.name // Use name as ID for now
            })
        });

        const data = await response.json();
        document.getElementById(typingId).remove();

        if (data.reply) {
            state.messages.push({ role: 'assistant', content: data.reply });
        } else {
            state.messages.push({ role: 'assistant', content: "Sorry, I'm having trouble connecting." });
        }
    } catch (error) {
        document.getElementById(typingId).remove();
        state.messages.push({ role: 'assistant', content: "Network error. Please check your connection." });
    }

    document.getElementById('chat-messages').innerHTML = renderMessages();
    lucide.createIcons();
    scrollToBottom();
}
