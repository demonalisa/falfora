import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage Database Service
 * Handles user data and tarot reading history.
 */

const KEYS = {
    USER: 'tarot_user',
    READINGS_PREFIX: 'tarot_readings_'
};

export const DatabaseService = {
    /**
     * Get user data
     * @param {string} userId 
     * @returns {Promise<object|null>}
     */
    getUser: async (userId) => {
        try {
            const data = await AsyncStorage.getItem(`${KEYS.USER}_${userId}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('[DatabaseService] Error getting user:', error);
            return null;
        }
    },

    /**
     * Save or update user data
     * @param {string} userId 
     * @param {object} data 
     */
    saveUser: async (userId, data) => {
        try {
            const existingUser = await DatabaseService.getUser(userId) || {};
            const updatedUser = {
                ...existingUser,
                ...data,
                id: userId,
                updatedAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem(`${KEYS.USER}_${userId}`, JSON.stringify(updatedUser));
            console.log(`[DatabaseService] User ${userId} saved.`);
            return updatedUser;
        } catch (error) {
            console.error('[DatabaseService] Error saving user:', error);
            return null;
        }
    },

    /**
     * Save a new tarot reading
     * @param {string} userId 
     * @param {object} readingData 
     */
    saveReading: async (userId, readingData) => {
        try {
            const readingsKey = `${KEYS.READINGS_PREFIX}${userId}`;
            const existingReadingsJson = await AsyncStorage.getItem(readingsKey);
            const readings = existingReadingsJson ? JSON.parse(existingReadingsJson) : [];

            const newReading = {
                id: Date.now().toString(),
                ...readingData,
                createdAt: new Date().toISOString(),
            };

            const updatedReadings = [newReading, ...readings].slice(0, 50); // Keep last 50 readings
            await AsyncStorage.setItem(readingsKey, JSON.stringify(updatedReadings));

            console.log(`[DatabaseService] New reading saved for ${userId}`);
            return newReading;
        } catch (error) {
            console.error('[DatabaseService] Error saving reading:', error);
            return null;
        }
    },

    /**
     * Get all readings for a user
     * @param {string} userId 
     * @returns {Promise<Array>}
     */
    getReadings: async (userId) => {
        try {
            const readingsKey = `${KEYS.READINGS_PREFIX}${userId}`;
            const data = await AsyncStorage.getItem(readingsKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('[DatabaseService] Error getting readings:', error);
            return [];
        }
    },

    /**
     * Clear all readings for a user
     * @param {string} userId 
     */
    clearReadings: async (userId) => {
        try {
            await AsyncStorage.removeItem(`${KEYS.READINGS_PREFIX}${userId}`);
            console.log(`[DatabaseService] Readings cleared for ${userId}`);
        } catch (error) {
            console.error('[DatabaseService] Error clearing readings:', error);
        }
    },

    /**
     * Delete user data and history
     * @param {string} userId 
     */
    deleteUser: async (userId) => {
        try {
            await AsyncStorage.removeItem(`${KEYS.USER}_${userId}`);
            await AsyncStorage.removeItem(`${KEYS.READINGS_PREFIX}${userId}`);
            console.log(`[DatabaseService] Data deleted for ${userId}`);
        } catch (error) {
            console.error('[DatabaseService] Error deleting data:', error);
        }
    }
};

