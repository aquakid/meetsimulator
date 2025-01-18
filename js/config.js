const CONFIG = {
    // Default events list
    defaultEvents: [
        { id: 'free50', name: '50 Freestyle', type: 'individual' },
        { id: 'free100', name: '100 Freestyle', type: 'individual' },
        { id: 'free200', name: '200 Freestyle', type: 'individual' },
        { id: 'free500', name: '500 Freestyle', type: 'individual' },
        { id: 'back100', name: '100 Backstroke', type: 'individual' },
        { id: 'breast100', name: '100 Breaststroke', type: 'individual' },
        { id: 'fly100', name: '100 Butterfly', type: 'individual' },
        { id: 'im200', name: '200 I.M.', type: 'individual' },
        { id: 'freeRelay200', name: '200 Freestyle Relay', type: 'relay' },
        { id: 'freeRelay400', name: '400 Freestyle Relay', type: 'relay' },
        { id: 'medleyRelay200', name: '200 Medley Relay', type: 'relay' }
    ],

    // Point system for individual events
    pointSystem: {
        1: 20, 2: 17, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11,
        9: 9, 10: 7, 11: 6, 12: 5, 13: 4, 14: 3, 15: 2, 16: 1
    },

    // Participation limits
    participationLimits: {
        total: 4,
        standard: {
            individual: 2,
            relay: 2
        },
        exception: {
            individual: 1,
            relay: 3
        }
    },

    // Storage keys
    storageKeys: {
        events: 'swimMeet_events',
        swimmers: 'swimMeet_swimmers',
        teams: 'swimMeet_teams',
        placements: 'swimMeet_placements',
        settings: 'swimMeet_settings'
    },

    // API endpoints (for future implementation)
    apiEndpoints: {
        swimmerData: 'https://utswimcoach.com/api/swimmers',
        eventData: 'https://utswimcoach.com/api/events'
    }
}; 