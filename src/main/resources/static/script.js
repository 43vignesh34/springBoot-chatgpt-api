// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const messagesContainer = document.getElementById('messagesContainer');
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

// State
let currentSessionId = generateSessionId();

/**
 * Generates a random session ID to keep conversation history isolated per chat.
 */
function generateSessionId() {
    return 'session-' + Math.random().toString(36).substring(2, 10);
}

/**
 * Theme Management
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme'); // default
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/**
 * Mobile Sidebar Toggle
 */
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar if clicked outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

/**
 * Auto-resize Textarea
 */
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    // Enable/disable send button
    if (this.value.trim().length > 0) {
        sendBtn.removeAttribute('disabled');
    } else {
        sendBtn.setAttribute('disabled', 'true');
    }
});

/**
 * Handle Enter key to send (Shift+Enter for newline)
 */
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (userInput.value.trim().length > 0) {
            handleSend();
        }
    }
});

sendBtn.addEventListener('click', () => {
    if (userInput.value.trim().length > 0) {
        handleSend();
    }
});

/**
 * Reset Chat
 */
newChatBtn.addEventListener('click', () => {
    currentSessionId = generateSessionId();
    messagesContainer.innerHTML = '';
    messagesContainer.style.display = 'none';
    welcomeScreen.style.display = 'flex';
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open'); // close sidebar on mobile
    }
});

/**
 * Triggered by prompt cards
 */
window.sendPrompt = function(text) {
    userInput.value = text;
    handleSend();
};

/**
 * Main Send Logic
 */
async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // Hide welcome screen, show messages container
    welcomeScreen.style.display = 'none';
    messagesContainer.style.display = 'flex';

    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.setAttribute('disabled', 'true');

    // Append User Message
    appendMessage('user', text);

    // Append Loading Indicator
    const typingId = appendTypingIndicator();

    // Scroll to bottom
    scrollToBottom();

    // Fetch from Backend
    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: currentSessionId,
                input: text
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        // The Spring Boot endpoint returns plain text
        const responseText = await response.text();
        
        // Remove typing indicator and append bot message
        removeElement(typingId);
        appendMessage('bot', responseText);

    } catch (error) {
        console.error("Error connecting to backend:", error);
        removeElement(typingId);
        appendMessage('bot', 'An error occurred while connecting to the server. Please check your backend logs.', true);
    }
}

/**
 * UI Builders
 */
function appendMessage(sender, text, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = `avatar ${sender}-avatar`;
    
    // Add icon inside avatar
    if (sender === 'user') {
        avatarDiv.innerHTML = '<ion-icon name="person-outline"></ion-icon>';
    } else {
        avatarDiv.innerHTML = '<ion-icon name="planet-outline"></ion-icon>';
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    if (isError) contentDiv.classList.add('error-text');
    contentDiv.textContent = text; // textContent handles escaping automatically

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function appendTypingIndicator() {
    const id = 'typing-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.id = id;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar bot-avatar';
    avatarDiv.innerHTML = '<ion-icon name="planet-outline"></ion-icon>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

    contentDiv.appendChild(typingDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    return id;
}

function removeElement(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Initialize
initTheme();
