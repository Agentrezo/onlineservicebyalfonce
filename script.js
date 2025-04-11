// Enhanced storage with improved persistence and error handling
const storage = {
    _memoryStore: {},
    setItem(key, value) {
        try {
            // Store in memory variable
            this._memoryStore[key] = JSON.stringify(value);
            
            // Try localStorage for persistence across reloads
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(key, JSON.stringify(value));
                    console.log(Data saved to localStorage: ${key});
                }
            } catch (e) {
                console.error('Error storing in localStorage:', e);
            }
        } catch (e) {
            console.error('Error storing data:', e);
            // Show error notification
            showNotification('Error saving data. Please try again.', 'error');
        }
    },
    getItem(key) {
        try {
            // Try to get from localStorage first for persistence
            let data = null;
            try {
                if (typeof localStorage !== 'undefined') {
                    data = localStorage.getItem(key);
                    if (data) {
                        return JSON.parse(data);
                    }
                }
            } catch (e) {
                console.error('Error retrieving from localStorage:', e);
            }
            
            // Fallback to memory storage
            return this._memoryStore[key] ? JSON.parse(this._memoryStore[key]) : null;
        } catch (e) {
            console.error('Error retrieving data:', e);
            return null;
        }
    },
    removeItem(key) {
        delete this._memoryStore[key];
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(key);
                console.log(Data removed from localStorage: ${key});
            }
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }
};

// Function to show notifications for success/error messages
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = notification-toast ${type === 'error' ? 'notification-error' : 'notification-success'};
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Generate a session ID for this browser session to track user reactions and orders
if (!storage.getItem('sessionId')) {
    storage.setItem('sessionId', 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));
}

// Get the current user's session ID
function getCurrentUserId() {
    return storage.getItem('sessionId');
}

// Initialize default data if not exists
function initializeDefaultData() {
    // Admin credentials
    if (!storage.getItem('adminCredentials')) {
        storage.setItem('adminCredentials', {
            username: 'Astra',
            password: '@Astra123'
        });
    }
    
    // Owner password
    if (!storage.getItem('ownerPassword')) {
        storage.setItem('ownerPassword', 'owner123');
    }
    
    // Slideshow text
    if (!storage.getItem('slideshowText')) {
        storage.setItem('slideshowText', 'Best university products and services in UDOM');
    }
    
    // Individual slideshow images
    for (let i = 0; i < 7; i++) {
        const slideKey = slideshowImage${i};
        if (!storage.getItem(slideKey) && i < 3) {
            // Set default images for first 3 slides
            storage.setItem(slideKey, {
                url: https://picsum.photos/id/${i+1}/800/400,
                id: slide${i}
            });
        }
    }
    
    // Service images (placeholder data)
    const serviceCategories = ['drawing-boards', 'mathematical-set', 'routers', 'sim-cards', 'sme-bundles', 'papers'];
    serviceCategories.forEach(category => {
        if (!storage.getItem(${category}Images)) {
            // Generate 5 placeholder images for each service
            const images = [];
            for (let i = 1; i <= 5; i++) {
                const seed = serviceCategories.indexOf(category) * 10 + i;
                images.push({
                    url: https://picsum.photos/id/${seed + 30}/450/450,
                    id: ${category}-${i}
                });
            }
            storage.setItem(${category}Images, images);
        }
    });
    
    // Notifications
    if (!storage.getItem('notifications')) {
        storage.setItem('notifications', [
            {
                id: 'notif1',
                message: 'Welcome to ALFONCE SERVICES! We offer a wide range of university products and services.',
                timestamp: new Date().toISOString(),
                comments: [],
                reactions: {},
                userReactions: {}
            }
        ]);
    }
    
    // Orders
    if (!storage.getItem('orders')) {
        storage.setItem('orders', []);
    }
    
    // Other services
    if (!storage.getItem('otherServices')) {
        storage.setItem('otherServices', [
            {
                id: 'service1',
                title: 'Custom Printing Services',
                description: 'We offer custom printing services for all your academic needs.',
                mediaType: 'image',
                mediaUrl: 'https://picsum.photos/id/60/800/450',
                timestamp: new Date().toISOString(),
                reactions: {},
                userReactions: {},
                comments: [],
                items: '▪Printing\n▪Scanning\n▪Photocopying\n▪Binding',
                showOnMainPage: false
            }
        ]);
    }
    
    // Developer code
    if (!storage.getItem('developerCode')) {
        storage.setItem('developerCode', '<h1>Welcome to ALFONCE SERVICES</h1>\n<p>This is a sample HTML code.</p>');
    }
}

// Initialize tabs functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected tab and content
            tab.classList.add('active');
            document.getElementById(${tabName}-content).classList.add('active');
            
            // Hide mobile menu after selection on mobile view
            if (window.innerWidth <= 768) {
                document.querySelector('.submenu').classList.remove('active');
            }
            
            // Load specific content based on tab
            if (tabName === 'notifications') {
                loadNotifications();
            } else if (tabName === 'orders') {
                loadOrders();
            } else if (tabName === 'other-services') {
                loadOtherServices();
            } else if (tabName === 'developer') {
                initializeDeveloperTab();
            }
        });
    });
    
    // Mobile menu button
    document.querySelector('.mobile-menu-button').addEventListener('click', () => {
        document.querySelector('.submenu').classList.toggle('active');
    });
}

// Initialize developer tab functionality
function initializeDeveloperTab() {
    // Initialize developer slideshow