class SwimmerManager {
    constructor() {
        this.swimmers = {};  // Organized by event
        this.loadSwimmers();
    }

    // Load swimmers from storage
    loadSwimmers() {
        const savedSwimmers = storage.load('swimmers');
        if (savedSwimmers) {
            this.swimmers = savedSwimmers;
        }
    }

    // Add a swimmer to an event
    addSwimmer(eventId, swimmer) {
        if (!this.swimmers[eventId]) {
            this.swimmers[eventId] = [];
        }

        // Add unique ID to swimmer
        swimmer.id = this.generateSwimmerId(swimmer.name);
        
        this.swimmers[eventId].push(swimmer);
        this.saveSwimmers();
        return swimmer;
    }

    // Get swimmers for an event
    getSwimmersForEvent(eventId) {
        return this.swimmers[eventId] || [];
    }

    // Get all events a swimmer is participating in
    getSwimmerEvents(swimmerId) {
        const events = [];
        Object.entries(this.swimmers).forEach(([eventId, swimmers]) => {
            if (swimmers.some(s => s.id === swimmerId)) {
                events.push(eventId);
            }
        });
        return events;
    }

    // Check participation limits
    checkParticipationLimits(swimmerId) {
        const events = this.getSwimmerEvents(swimmerId);
        const individualEvents = events.filter(eventId => {
            const event = eventManager.getEvent(eventId);
            return event && event.type === 'individual';
        });
        const relayEvents = events.filter(eventId => {
            const event = eventManager.getEvent(eventId);
            return event && event.type === 'relay';
        });

        return {
            total: events.length,
            individual: individualEvents.length,
            relay: relayEvents.length,
            withinLimits: this.isWithinLimits(individualEvents.length, relayEvents.length)
        };
    }

    // Check if within participation limits
    isWithinLimits(individualCount, relayCount) {
        const limits = CONFIG.participationLimits;
        const totalCount = individualCount + relayCount;

        if (totalCount > limits.total) return false;

        // Check standard limit (2 individual + 2 relay)
        const standardOk = individualCount <= limits.standard.individual && 
                          relayCount <= limits.standard.relay;

        // Check exception limit (1 individual + 3 relay)
        const exceptionOk = individualCount <= limits.exception.individual && 
                           relayCount <= limits.exception.relay;

        return standardOk || exceptionOk;
    }

    // Generate unique ID for swimmer
    generateSwimmerId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '') + 
               '_' + Date.now().toString(36);
    }

    // Save swimmers to storage
    saveSwimmers() {
        storage.save('swimmers', this.swimmers);
    }

    // Remove swimmer from event
    removeSwimmerFromEvent(eventId, swimmerId) {
        if (this.swimmers[eventId]) {
            this.swimmers[eventId] = this.swimmers[eventId].filter(s => s.id !== swimmerId);
            this.saveSwimmers();
            return true;
        }
        return false;
    }

    // Clear all swimmers
    clearAll() {
        this.swimmers = {};
        this.saveSwimmers();
    }
}

// Create global swimmer manager instance
const swimmerManager = new SwimmerManager(); 