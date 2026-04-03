import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const KEYS = {
    USER: 'tarot_user',
    LOCAL_READINGS_PREFIX: 'tarot_readings_local_' // Still keep for offline backup maybe
};

export const DatabaseService = {
    /**
     * Get user profile from local or server (can be proxy for sync)
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
            return updatedUser;
        } catch (error) {
            console.error('[DatabaseService] Error saving user:', error);
            return null;
        }
    },

    /**
     * NEW: Get readings from MongoDB via Backend
     * @param {string} token - JWT Token
     */
    getReadingsFromServer: async (token) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/readings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Fetch readings failed');
            return await response.json();
        } catch (error) {
            console.error('[DatabaseService] Server fetch error:', error);
            return [];
        }
    },

    /**
     * NEW: Delete a reading from MongoDB
     */
    deleteReadingFromServer: async (readingId, token) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/readings/${readingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.ok;
        } catch (error) {
            console.error('[DatabaseService] Server delete error:', error);
            return false;
        }
    }
};
