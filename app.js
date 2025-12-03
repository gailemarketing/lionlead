
// State
let state = {
    user: null,
    currentTab: 'journey',
    messages: [
        {
            role: 'assistant',
            content: "Hi! I'm LionLead, your personal leadership coach. I can help you prepare for 1:1s, draft difficult emails, or just vent about a tough day. What's on your mind?"
        }
    ],
    isTyping: false
};

// Supabase Configuration
const supabaseUrl = 'https://knchkxxjcjeitlcjdfeo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuY2hreHhqY2plaXRsY2pkZmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTQ3OTIsImV4cCI6MjA4MDE5MDc5Mn0.3dFCwWCwVo86RAXpdh90ubz0RC31xNFPFYRKXDGbCm8';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Mock Data (Fallback)
const JOURNEY_DATA = [
    { day: 1, theme: "Identity Shift", title: "Embracing Your New Role", insight: "Your success now comes from your team's success.", action: "Schedule 1:1s with all direct reports.", script: "I'd love to hear your thoughts on what's going well...", reflection_question: "What's one thing you need to do differently?" },
    { day: 2, theme: "Identity Shift", title: "Active Listening", insight: "Great leaders listen more than they talk.", action: "Practice active listening in your next meeting.", script: "Thank you for sharing that. I appreciate your honesty...", reflection_question: "What did you learn by listening?" },
];

// Notification Helper
function showNotification(title, message) {
    const modal = document.getElementById('notification-modal');
    const titleEl = document.getElementById('notification-title');
    const msgEl = document.getElementById('notification-message');

    titleEl.textContent = title;
    msgEl.textContent = message;
    modal.classList.remove('hidden');
}

document.getElementById('close-notification').addEventListener('click', () => {
    document.getElementById('notification-modal').classList.add('hidden');
});

// Init
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (typeof lucide === 'undefined') {
            throw new Error("Lucide icons library failed to load.");
        }
        lucide.createIcons();

        // Event Listeners for Static Elements
        const startBtn = document.getElementById('start-btn');
        const modal = document.getElementById('onboarding-modal');
        const modalBackdrop = document.getElementById('modal-backdrop');
        const onboardingForm = document.getElementById('onboarding-form');
        const closeOnboardingBtn = document.getElementById('close-onboarding');
        const switchToLoginBtn = document.getElementById('switch-to-login');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
        }

        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        if (closeOnboardingBtn) {
            closeOnboardingBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        if (onboardingForm) {
            onboardingForm.addEventListener('submit', handleOnboardingSubmit);
        }

        // Login Modal Logic
        const loginBtn = document.getElementById('login-btn');
        const loginModal = document.getElementById('login-modal');
        const closeLoginBtn = document.getElementById('close-login');
        const loginBackdrop = document.getElementById('login-backdrop');
        const loginForm = document.getElementById('login-form');
        const switchToSignupBtn = document.getElementById('switch-to-signup');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (state.user) {
                    logout();
                } else {
                    loginModal.classList.remove('hidden');
                }
            });
        }

        if (switchToLoginBtn) {
            switchToLoginBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                loginModal.classList.remove('hidden');
            });
        }

        if (switchToSignupBtn) {
            switchToSignupBtn.addEventListener('click', () => {
                loginModal.classList.add('hidden');
                modal.classList.remove('hidden');
            });
        }

        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', () => {
                loginModal.classList.add('hidden');
            });
        }

        if (loginBackdrop) {
            loginBackdrop.addEventListener('click', () => {
                loginModal.classList.add('hidden');
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }

        // Logout Modal Logic
        const logoutModal = document.getElementById('logout-modal');
        const confirmLogoutBtn = document.getElementById('confirm-logout');
        const cancelLogoutBtn = document.getElementById('cancel-logout');
        const logoutBackdrop = document.getElementById('logout-backdrop');

        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener('click', async () => {
                await supabase.auth.signOut();
                logoutModal.classList.add('hidden');
                // onAuthStateChange will handle UI update
            });
        }

        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener('click', () => {
                logoutModal.classList.add('hidden');
            });
        }

        if (logoutBackdrop) {
            logoutBackdrop.addEventListener('click', () => {
                logoutModal.classList.add('hidden');
            });
        }

        // Reset Password Logic
        const resetModal = document.getElementById('reset-modal');
        const forgotPasswordLink = document.getElementById('forgot-password-link');
        const closeResetBtn = document.getElementById('close-reset');
        const resetBackdrop = document.getElementById('reset-backdrop');
        const resetForm = document.getElementById('reset-form');

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', () => {
                loginModal.classList.add('hidden');
                resetModal.classList.remove('hidden');
            });
        }

        if (closeResetBtn) {
            closeResetBtn.addEventListener('click', () => {
                resetModal.classList.add('hidden');
            });
        }

        if (resetBackdrop) {
            resetBackdrop.addEventListener('click', () => {
                resetModal.classList.add('hidden');
            });
        }

        if (resetForm) {
            resetForm.addEventListener('submit', handleResetPassword);
        }

        // Existing Account Modal Logic
        const existingAccountModal = document.getElementById('existing-account-modal');
        const existingLoginBtn = document.getElementById('existing-login-btn');
        const closeExistingBtn = document.getElementById('close-existing');
        const existingBackdrop = document.getElementById('existing-account-backdrop');

        if (existingLoginBtn) {
            existingLoginBtn.addEventListener('click', () => {
                existingAccountModal.classList.add('hidden');
                loginModal.classList.remove('hidden');
            });
        }

        if (closeExistingBtn) {
            closeExistingBtn.addEventListener('click', () => {
                existingAccountModal.classList.add('hidden');
            });
        }

        if (existingBackdrop) {
            existingBackdrop.addEventListener('click', () => {
                existingAccountModal.classList.add('hidden');
            });
        }

        // Check User State & Session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const metadata = session.user.user_metadata;
            state.user = {
                email: session.user.email,
                name: metadata.name || session.user.email.split('@')[0],
                role: metadata.role || "Leader",
                teamSize: metadata.teamSize || "Unknown",
                currentDay: metadata.currentDay || 1,
                completedDays: metadata.completedDays || [],
                reflections: metadata.reflections || {}
            };

            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) loginBtn.innerText = "Log out";

            showApp();
        } else {
            showHome();
        }

        // Listen for Auth Changes
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                const metadata = session.user.user_metadata;
                state.user = {
                    email: session.user.email,
                    name: metadata.name || session.user.email.split('@')[0],
                    role: metadata.role || "Leader",
                    teamSize: metadata.teamSize || "Unknown",
                    currentDay: metadata.currentDay || 1,
                    completedDays: metadata.completedDays || [],
                    reflections: metadata.reflections || {}
                };

                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) loginBtn.innerText = "Log out";

                showApp();
            } else if (event === 'SIGNED_OUT') {
                state.user = null;
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) loginBtn.innerText = "Log in";
                showHome();
            }
        });

    } catch (e) {
        console.error("App Init Error:", e);
    }
});

async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Logging in...";
    btn.disabled = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        document.getElementById('login-modal').classList.add('hidden');
        showNotification("Welcome Back", "Successfully logged in!");
    } catch (error) {
        // Fallback: Check if session was created despite error
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            document.getElementById('login-modal').classList.add('hidden');
            showNotification("Welcome Back", "Successfully logged in!");
            // Ensure UI is updated
            const metadata = session.user.user_metadata;
            state.user = {
                email: session.user.email,
                name: metadata.name || session.user.email.split('@')[0],
                role: metadata.role || "Leader",
                teamSize: metadata.teamSize || "Unknown",
                currentDay: metadata.currentDay || 1,
                completedDays: metadata.completedDays || [],
                reflections: metadata.reflections || {}
            };
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) loginBtn.innerText = "Log out";
            showApp();
        } else {
            showNotification("Login Failed", error.message);
        }
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function showApp() {
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    renderApp();
}

function showHome() {
    document.getElementById('hero-section').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
    document.getElementById('mobile-nav').classList.add('hidden');
}

async function logout() {
    document.getElementById('logout-modal').classList.remove('hidden');
}

async function handleOnboardingSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    // For this hackathon, we are using a simple password field.
    // In a real app, we would have better validation.
    const password = document.getElementById('password') ? document.getElementById('password').value : prompt("Please create a password for your account:");
    const role = document.getElementById('role').value;
    const teamSize = document.getElementById('teamSize').value;

    if (!name || !email || !password) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Creating account...";
    btn.disabled = true;

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    role: role,
                    teamSize: teamSize,
                    currentDay: 1,
                    completedDays: [],
                    reflections: {}
                }
            }
        });

        if (error) throw error;

        showNotification("Success", "Account created! Please check your email to confirm your account.");
        document.getElementById('onboarding-modal').classList.add('hidden');

    } catch (error) {
        if (error.message.includes("already registered") || error.status === 400 || error.status === 422) {
            // Check if it's actually an "already registered" error. 
            // Supabase often returns "User already registered" message.
            if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
                document.getElementById('onboarding-modal').classList.add('hidden');
                document.getElementById('existing-account-modal').classList.remove('hidden');
                return;
            }
        }
        showNotification("Error", "Signup failed: " + error.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

async function handleResetPassword(e) {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
    if (!email) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;

    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin, // Redirect back to the site
        });

        if (error) throw error;

        document.getElementById('reset-modal').classList.add('hidden');
        showNotification("Check your email", "We've sent you a password reset link.");
    } catch (error) {
        showNotification("Error", error.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
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

async function completeDay() {
    if (!state.user.completedDays.includes(state.user.currentDay)) {
        const day = state.user.currentDay;
        const reflection = state.user.reflections[day] || '';

        // Optimistic UI Update
        state.user.completedDays.push(day);
        if (state.user.currentDay < 30) {
            state.user.currentDay++;
        }
        localStorage.setItem('lionlead_user', JSON.stringify(state.user));
        renderApp();

        // Save to Drive (Background)
        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: state.user.email, // Use email as ID for now
                    userName: state.user.name,
                    day: day,
                    reflection: reflection
                })
            });
            console.log("Progress saved to Drive");
        } catch (err) {
            console.error("Failed to save progress to Drive:", err);
            // We don't revert UI because local storage is the source of truth for the user
            // But we could show a toast notification here
        }
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
