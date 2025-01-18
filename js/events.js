class EventManager {
    constructor() {
        this.events = [];
        this.currentEvent = null;
        this.loadEvents();
    }

    // Load events from storage or use defaults
    loadEvents() {
        const savedEvents = storage.load('events');
        if (savedEvents) {
            this.events = savedEvents;
        } else {
            this.events = CONFIG.defaultEvents;
            storage.save('events', this.events);
        }
    }

    // Get all events
    getAllEvents() {
        return this.events;
    }

    // Get event by ID
    getEvent(eventId) {
        return this.events.find(event => event.id === eventId);
    }

    // Add new event
    addEvent(eventName, eventType = 'individual') {
        const id = this.generateEventId(eventName);
        const newEvent = {
            id,
            name: eventName,
            type: eventType
        };
        
        this.events.push(newEvent);
        storage.save('events', this.events);
        return newEvent;
    }

    // Remove event
    removeEvent(eventId) {
        const index = this.events.findIndex(event => event.id === eventId);
        if (index !== -1) {
            this.events.splice(index, 1);
            storage.save('events', this.events);
            return true;
        }
        return false;
    }

    // Set current event
    setCurrentEvent(eventId) {
        const event = this.getEvent(eventId);
        if (event) {
            this.currentEvent = event;
            return true;
        }
        return false;
    }

    // Get current event
    getCurrentEvent() {
        return this.currentEvent;
    }

    // Generate event ID from name
    generateEventId(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .replace(/\s+/g, '') +
            '_' +
            Date.now().toString(36);
    }

    // Reset to default events
    resetToDefault() {
        this.events = CONFIG.defaultEvents;
        storage.save('events', this.events);
        this.currentEvent = null;
    }

    // Check if event exists
    eventExists(eventName) {
        return this.events.some(event => 
            event.name.toLowerCase() === eventName.toLowerCase()
        );
    }

    // Get events by type
    getEventsByType(type) {
        return this.events.filter(event => event.type === type);
    }
}

// Create global event manager instance
const eventManager = new EventManager(); 