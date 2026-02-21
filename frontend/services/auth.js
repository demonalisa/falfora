import Auth0 from 'react-native-auth0';

const AUTH0_DOMAIN = 'dev-73wqskgqn01eddi4.us.auth0.com';
const AUTH0_CLIENT_ID = 'eMwEpuHCKe9U6kisk4WbHHNrQIsLfWqG';
const AUTH0_AUDIENCE = 'https://tarot-api';

const auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID
});

export const AuthService = {
    /**
     * Login with Auth0 Universal Login (supports Google, Apple, Email etc.)
     * @returns {Promise<{user: object, accessToken: string}>}
     */
    login: async () => {
        try {
            const credentials = await auth0.webAuth.authorize({
                scope: 'openid profile email',
                audience: AUTH0_AUDIENCE,
            });

            // Decode the ID token to get user info
            // ID token is a JWT with base64 encoded payload
            const idToken = credentials.idToken;
            const payload = JSON.parse(
                atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
            );

            return {
                user: {
                    id: payload.sub,
                    name: payload.name || payload.nickname || 'Cosmic Traveler',
                    email: payload.email,
                    picture: payload.picture,
                },
                accessToken: credentials.accessToken,
            };
        } catch (error) {
            console.error('[AuthService] Login error:', error);
            throw error;
        }
    },

    /**
     * Logout from Auth0
     */
    logout: async () => {
        try {
            await auth0.webAuth.clearSession();
            console.log('[AuthService] Logged out successfully.');
        } catch (error) {
            console.error('[AuthService] Logout error:', error);
            throw error;
        }
    },
};
