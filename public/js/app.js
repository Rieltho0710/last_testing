import { auth, onAuthChange } from './services/auth.js';
import { AdminView } from './views/admin.js';
import { MemberView } from './views/member.js';
import { AuthView } from './views/auth.js';
import { renderHeader, renderFooter } from './views/components/layout.js';

// Initialize UI
document.getElementById('header').innerHTML = renderHeader();
document.getElementById('footer').innerHTML = renderFooter();

// Handle authentication state changes
onAuthChange(async (user) => {
    const mainContent = document.getElementById('main-content');
    
    if (!user) {
        mainContent.innerHTML = AuthView();
        return;
    }

    if (user.role === 'admin') {
        new AdminView();
    } else {
        new MemberView();
    }
});

// Initialize service worker for notifications
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
            console.log('Service Worker registered');
        });
}
