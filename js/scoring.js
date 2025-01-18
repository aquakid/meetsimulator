class ScoringSystem {
    constructor() {
        this.placements = {};  // Organized by eventId
        this.loadPlacements();
    }

    // Load placements from storage
    loadPlacements() {
        const savedPlacements = storage.load('placements');
        if (savedPlacements) {
            this.placements = savedPlacements;
        }
    }

    // Update placement for a swimmer
    updatePlacement(eventId, swimmerId, place) {
        if (!this.placements[eventId]) {
            this.placements[eventId] = {};
        }

        // Remove swimmer from any existing placement in this event
        Object.entries(this.placements[eventId]).forEach(([p, sId]) => {
            if (sId === swimmerId) {
                delete this.placements[eventId][p];
            }
        });

        // Assign new placement
        this.placements[eventId][place] = swimmerId;
        this.savePlacements();
    }

    // Get placement for a swimmer in an event
    getPlacement(eventId, swimmerId) {
        if (!this.placements[eventId]) return null;
        
        for (const [place, sId] of Object.entries(this.placements[eventId])) {
            if (sId === swimmerId) {
                return parseInt(place);
            }
        }
        return null;
    }

    // Calculate points for a placement
    getPoints(place) {
        return CONFIG.pointSystem[place] || 0;
    }

    // Calculate team scores for an event
    calculateEventScores(eventId) {
        const scores = {};
        
        if (!this.placements[eventId]) return scores;

        Object.entries(this.placements[eventId]).forEach(([place, swimmerId]) => {
            const swimmer = this.getSwimmerById(swimmerId);
            if (swimmer) {
                const points = this.getPoints(parseInt(place));
                scores[swimmer.team] = (scores[swimmer.team] || 0) + points;
            }
        });

        return scores;
    }

    // Calculate total team scores
    calculateTotalScores() {
        const totalScores = {};

        Object.keys(this.placements).forEach(eventId => {
            const eventScores = this.calculateEventScores(eventId);
            Object.entries(eventScores).forEach(([team, points]) => {
                totalScores[team] = (totalScores[team] || 0) + points;
            });
        });

        return totalScores;
    }

    // Get swimmer details by ID
    getSwimmerById(swimmerId) {
        // Search through all events
        for (const eventId in swimmerManager.swimmers) {
            const swimmer = swimmerManager.swimmers[eventId].find(s => s.id === swimmerId);
            if (swimmer) return swimmer;
        }
        return null;
    }

    // Save placements to storage
    savePlacements() {
        storage.save('placements', this.placements);
    }

    // Clear all placements
    clearPlacements() {
        this.placements = {};
        this.savePlacements();
    }

    // Get all placements for an event
    getEventPlacements(eventId) {
        return this.placements[eventId] || {};
    }

    // Generate score breakdown for a team
    generateTeamBreakdown(team) {
        const breakdown = {
            team,
            totalPoints: 0,
            events: {}
        };

        Object.entries(this.placements).forEach(([eventId, places]) => {
            const event = eventManager.getEvent(eventId);
            if (!event) return;

            Object.entries(places).forEach(([place, swimmerId]) => {
                const swimmer = this.getSwimmerById(swimmerId);
                if (swimmer && swimmer.team === team) {
                    const points = this.getPoints(parseInt(place));
                    if (!breakdown.events[event.name]) {
                        breakdown.events[event.name] = [];
                    }
                    breakdown.events[event.name].push({
                        swimmer: swimmer.name,
                        place: parseInt(place),
                        points
                    });
                    breakdown.totalPoints += points;
                }
            });
        });

        return breakdown;
    }
}

// Create global scoring system instance
const scoringSystem = new ScoringSystem(); 