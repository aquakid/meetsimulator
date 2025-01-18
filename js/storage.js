class StorageManager {
    constructor() {
        this.keys = CONFIG.storageKeys;
    }

    // Check if localStorage is available
    isAvailable() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    // Save data to localStorage
    save(key, data) {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return false;
        }
        try {
            localStorage.setItem(this.keys[key], JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    }

    // Load data from localStorage
    load(key) {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return null;
        }
        try {
            const data = localStorage.getItem(this.keys[key]);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return null;
        }
    }

    // Clear specific data
    clear(key) {
        if (!this.isAvailable()) return false;
        try {
            localStorage.removeItem(this.keys[key]);
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }

    // Clear all swim meet data
    clearAll() {
        if (!this.isAvailable()) return false;
        try {
            Object.values(this.keys).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (e) {
            console.error('Error clearing all data:', e);
            return false;
        }
    }

    // Get approximate size of stored data
    getStorageSize() {
        if (!this.isAvailable()) return 0;
        let totalSize = 0;
        Object.values(this.keys).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                totalSize += (key.length + item.length) * 2; // Unicode characters = 2 bytes
            }
        });
        return totalSize;
    }

    // Check if we're approaching storage limits
    isApproachingLimit() {
        const maxSize = 5 * 1024 * 1024; // 5MB typical limit
        const currentSize = this.getStorageSize();
        return currentSize > (maxSize * 0.8); // Warning at 80% capacity
    }
}

// Create global storage manager instance
const storage = new StorageManager(); 