// State
let state = {
    user: null, // { name, role, email, currentDay, completedDays: [], reflections: {} }
    currentTab: 'journey', // 'journey', 'coach', 'practice'
    messages: [
        {
            role: 'assistant',
            content: "Hi! I'm LionLead, your personal leadership coach. I can help you prepare for 1:1s, draft difficult emails, or just vent about a tough day. What's on your mind?"
        }
    ],
    isTyping: false
};

// Mock Data
const JOURNEY_DATA = [
    { day: 1, theme: "Identity Shift", title: "Embracing Your New Role", insight: "Your success now comes from your team's success.", action: "Schedule 1:1s with all direct reports.", script: "I'd love to hear your thoughts on what's going well...", reflection_question: "What's one thing you need to do differently?" },
    { day: 2, theme: "Identity Shift", title: "Active Listening", insight: "Great leaders listen more than they talk.", action: "Practice active listening in your next meeting.", script: "Thank you for sharing that. I appreciate your honesty...", reflection_question: "What did you learn by listening?" },
    // Add more days as needed or fetch dynamically
];

// Init
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof lucide === 'undefined') {
            throw new Error("Lucide icons library failed to load.");
        }
        lucide.createIcons();

        // Check LocalStorage
        const savedUser = localStorage.getItem('lionlead_user');
        if (savedUser) {
            state.user = JSON.parse(savedUser);
            renderApp();
        } else {
            renderHome();
        }
    } catch (e) {
        document.body.innerHTML = `<div style="color:red; padding:20px;"><h1>Application Error</h1><p>${e.message}</p><pre>${e.stack}</pre></div>`;
        console.error("App Init Error:", e);
    }
});
lucide.createIcons();
if (state.currentTab === 'coach') scrollToBottom();
}

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
                </p>
            </div>

            <button onclick="showOnboarding()" class="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,200,0,0.5)]">
                <span class="mr-2 text-lg font-bold">Start My Journey</span>
                <i data-lucide="arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1"></i>
            </button>
        </div>

        <!-- Onboarding Modal -->
        <div id="onboarding-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
            <div class="relative bg-card w-[90%] max-w-md rounded-3xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-10 duration-300 border border-border/50">
                
                <!-- Close Button -->
                <button onclick="closeOnboarding()" class="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <div class="text-center space-y-2 mb-6">
                    <div class="w-12 h-12 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-3">
                        <span class="text-2xl">👋</span>
                    </div>
                    <h2 class="text-2xl font-heading font-bold">Welcome Aboard</h2>
                    <p class="text-sm text-muted-foreground">Let's personalize your experience.</p>
                </div>

                <form onsubmit="handleOnboardingSubmit(event)" class="space-y-4">
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold ml-1">Name</label>
                        <input type="text" name="name" required class="w-full h-11 px-4 rounded-xl bg-muted/30 border border-muted focus:border-primary outline-none transition-all text-sm" placeholder="Your first name">
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold ml-1">Company Email</label>
                        <input type="email" name="email" required class="w-full h-11 px-4 rounded-xl bg-muted/30 border border-muted focus:border-primary outline-none transition-all text-sm" placeholder="you@company.com">
                    </div>
                    
                    <div class="space-y-1.5">
                        <label class="text-sm font-semibold ml-1">Role</label>
                        <select name="role" class="w-full h-11 px-4 rounded-xl bg-muted/30 border border-muted outline-none transition-all text-sm">
                            <option>Product Lead</option>
                            <option>Engineering Manager</option>
                            <option>Team Lead</option>
                            <option>Design Lead</option>
                        </select>
                    </div>

                    <button type="submit" class="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-lg mt-2">
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

function closeOnboarding() {
    document.getElementById('onboarding-modal').classList.add('hidden');
}

function handleOnboardingSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');

    // Simple Email Validation
    if (!email || !email.includes('@') || !email.includes('.')) {
        alert("Please enter a valid company email.");
        return;
    }

    state.user = {
        name: formData.get('name'),
        email: email,
        role: formData.get('role'),
        currentDay: 1,
        completedDays: [],
        reflections: {}
    };

    localStorage.setItem('lionlead_user', JSON.stringify(state.user));
    renderApp();
}

function renderJourney() {
    const currentContent = JOURNEY_DATA.find(d => d.day === state.user.currentDay) || JOURNEY_DATA[0];
    const progress = Math.round((state.user.completedDays.length / 30) * 100);

    return `
        <div class="space-y-8">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-3xl font-heading font-bold">Your Journey</h2>
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

            <!-- Daily Card -->
            <div class="bg-card rounded-[2rem] shadow-xl overflow-hidden border-none">
                <div class="h-2 bg-gradient-to-r from-primary to-orange-400 w-full"></div>
                <div class="p-8 space-y-8">
                    <div>
                        <span class="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">${currentContent.theme}</span>
                        <h3 class="text-4xl font-heading font-bold mt-4 leading-tight">${currentContent.title}</h3>
                    </div>

                    <section>
                        <h4 class="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Insight</h4>
                        <p class="text-lg font-medium leading-relaxed">${currentContent.insight}</p>
                    </section>

                    <button onclick="switchTab('practice')" class="w-full h-14 rounded-full bg-secondary text-secondary-foreground font-bold text-lg hover:bg-secondary/80 transition-all">
                        Go to Practice
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderCoach() {
    return `
        <div class="bg-card rounded-[2rem] shadow-xl overflow-hidden border border-border/50 h-[75vh] flex flex-col">
            <div class="p-6 border-b border-border flex items-center gap-4 bg-muted/30">
                <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white shadow-sm">
                    <span class="text-2xl">🦁</span>
                </div>
                <div>
                    <h3 class="font-heading font-bold text-lg">LionLead Coach</h3>
                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </div>
                </div>
            </div>

            <div id="chat-messages" class="flex-1 p-6 overflow-y-auto space-y-6">
                ${renderMessages()}
            </div>

            <div class="p-4 bg-muted/30 border-t border-border">
                <form onsubmit="sendMessage(event)" class="relative flex items-center">
                    <input id="chat-input" type="text" class="w-full h-14 pl-6 pr-14 rounded-full border-2 border-border focus:border-primary bg-background text-lg shadow-sm outline-none" placeholder="Ask for advice...">
                    <button type="submit" class="absolute right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <i data-lucide="send" class="w-5 h-5"></i>
                    </button>
                </form>
            </div>
        </div>
    `;
}

function renderPractice() {
    const currentContent = JOURNEY_DATA.find(d => d.day === state.user.currentDay) || JOURNEY_DATA[0];
    const isCompleted = state.user.completedDays.includes(state.user.currentDay);

    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-heading font-bold">Practice & Reflect</h2>

            <div class="bg-card rounded-[2rem] shadow-xl p-8 space-y-8">
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

                <div class="bg-muted/30 p-6 rounded-2xl border border-border">
                    <h4 class="text-sm font-bold uppercase tracking-wider mb-4">Daily Reflection</h4>
                    <p class="text-sm text-muted-foreground mb-4 italic">${currentContent.reflection_question}</p>
                    <textarea id="reflection-input" class="w-full h-32 bg-background rounded-xl p-4 border-none resize-none focus:ring-1 focus:ring-primary" placeholder="Write your thoughts...">${state.user.reflections[state.user.currentDay] || ''}</textarea>
                    <div class="mt-4 flex justify-end">
                        <button onclick="saveReflection()" class="text-sm text-muted-foreground hover:text-primary font-medium">Save Note</button>
                    </div>
                </div>

                <button onclick="completeDay()" class="w-full h-14 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-[1.02] ${isCompleted ? 'bg-green-500 text-white cursor-default' : 'bg-primary text-primary-foreground hover:bg-primary/90'}">
                    ${isCompleted ? '✓ Completed' : 'Mark Day Complete'}
                </button>
            </div>
        </div>
    `;
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
    if (day <= state.user.currentDay) {
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
        renderApp();
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

    state.messages.push({ role: 'user', content: text });
    input.value = '';

    document.getElementById('chat-messages').innerHTML = renderMessages();
    lucide.createIcons();
    scrollToBottom();

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
                userId: state.user.name
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
