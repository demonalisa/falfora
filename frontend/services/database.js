/**
 * In-memory Database Service
 * In the future, this can be swapped with AsyncStorage, SQLite, or an API call.
 */

let USERS_DB = {};

export const DatabaseService = {
    /**
     * Get user data by ID
     * @param {string} userId 
     * @returns {object|null}
     */
    getUser: (userId) => {
        return USERS_DB[userId] || null;
    },

    /**
     * Save or update user data
     * @param {string} userId 
     * @param {object} data 
     */
    saveUser: (userId, data) => {
        USERS_DB[userId] = {
            ...USERS_DB[userId],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        console.log(`[DatabaseService] User ${userId} saved:`, USERS_DB[userId]);
        return USERS_DB[userId];
    },

    /**
     * Delete user data
     * @param {string} userId 
     */
    deleteUser: (userId) => {
        delete USERS_DB[userId];
    },

    /**
     * Get all users (for debugging)
     */
    getAllUsers: () => {
        return { ...USERS_DB };
    }
};
