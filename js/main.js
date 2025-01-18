// Fix for Swim Meet Score Tracker Initialization Error

// Check if DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Ensure all script files are loaded correctly
        const requiredScripts = [
            'config.js',
            'storage.js',
            'events.js',
            'swimmers.js',
            'scoring.js',
            'ui.js'
        ];

        const loadedScripts = Array.from(document.scripts).map(script => script.src.split('/').pop());

        const missingScripts = requiredScripts.filter(script => !loadedScripts.includes(script));

        if (missingScripts.length > 0) {
            throw new Error(`Missing required scripts: ${missingScripts.join(', ')}`);
        }

        // Initialize the main application
        window.app = new SwimMeetApp();
        console.log('Swim Meet Score Tracker initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        alert(`Failed to initialize application: ${error.message}\nPlease check console for details.`);
    }
});

// Error handling for UI initialization
try {
    window.ui = new UI();
} catch (error) {
    console.error('UI Initialization Error:', error);
    alert('Failed to initialize UI. Please check console for details.');
}

// Improved error handling for app reset
SwimMeetApp.prototype.reset = function() {
    try {
        storage.clearAll();
        eventManager.resetToDefault();
        swimmerManager.clearAll();
        if (window.scoringSystem) {
            scoringSystem.clearPlacements();
        }
        window.location.reload();
    } catch (error) {
        console.error('Error resetting application:', error);
        alert('Failed to reset application state. Please check console for details.');
    }
};

class SwimMeetApp {
    constructor() {
        // Initialize core components in order
        this.storage = new StorageManager();
        this.eventManager = new EventManager();
        this.swimmerManager = new SwimmerManager();
        this.scoringSystem = new ScoringSystem();
        this.ui = new UI();
        
        // Initialize the application
        this.init();
    }

    init() {
        try {
            // Load saved data
            this.eventManager.loadEvents();
            this.swimmerManager.loadSwimmers();
            this.scoringSystem.loadPlacements();
            
            // Initialize UI components
            this.ui.renderEvents();
            
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
            throw new Error('Failed to initialize application: ' + error.message);
        }
    }

    reset() {
        try {
            // Clear all data
            this.storage.clearAll();
            
            // Reset all managers to default state
            this.eventManager.resetToDefault();
            this.swimmerManager = new SwimmerManager();
            this.scoringSystem = new ScoringSystem();
            
            // Re-render UI
            this.ui.renderEvents();
            
            console.log('Application reset successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error resetting application:', error);
            alert('Failed to reset application state. Please check console for details.');
        }
    }
}

// Create global instances
window.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new SwimMeetApp();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        alert('Failed to initialize application: ' + error.message + '\nPlease check console for details.');
    }
});
