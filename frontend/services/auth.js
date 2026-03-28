import Auth0 from 'react-native-auth0';
import * as Linking from 'expo-linking';
import { createAuth0Client } from '@auth0/auth0-spa-js';

const AUTH0_DOMAIN = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = process.env.EXPO_PUBLIC_AUTH0_AUDIENCE;

const auth0Native = new Auth0({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID
});

let spaClient = null;

const getSpaClient = async () => {
    if (spaClient) return spaClient;
    spaClient = await createAuth0Client({
        domain: AUTH0_DOMAIN,
        clientId: AUTH0_CLIENT_ID,
        authorizationParams: {
            audience: AUTH0_AUDIENCE,
            scope: 'openid profile email'
        },
        cacheLocation: 'localstorage',
        useRefreshTokens: true
    });
    return spaClient;
};

export const AuthService = {
    /**
     * Login with Auth0 Universal Login (supports Google, Apple, Email etc.)
     * @returns {Promise<{user: object, accessToken: string}>}
     */
    login: async () => {
        try {
            if (typeof window !== 'undefined') {
                // WEB FLOW (using @auth0/auth0-spa-js)
                const client = await getSpaClient();
                
                // Use popup instead of redirect for smoother integration with Expo/RN Web
                await client.loginWithPopup();
                
                const user = await client.getUser();
                const accessToken = await client.getTokenSilently();

                return {
                    user: {
                        id: user.sub,
                        name: user.name || user.nickname || 'Cosmic Traveler',
                        email: user.email,
                        picture: user.picture,
                    },
                    accessToken,
                };
            } else {
                // NATIVE FLOW (using react-native-auth0)
                const redirectUri = Linking.createURL('callback');
                console.log('[AuthService] Using native redirectUri:', redirectUri);

                const credentials = await auth0Native.webAuth.authorize({
                    scope: 'openid profile email',
                    audience: AUTH0_AUDIENCE,
                    redirectUri: redirectUri
                });

                // Decode the ID token to get user info
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
            }
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
            if (typeof window !== 'undefined') {
                // WEB FLOW
                const client = await getSpaClient();
                const returnTo = window.location.origin + "/falfora/";
                
                await client.logout({
                    logoutParams: {
                        returnTo: returnTo
                    }
                });
            } else {
                // NATIVE FLOW
                const returnTo = Linking.createURL('');
                await auth0Native.webAuth.clearSession({ returnTo });
            }
            console.log('[AuthService] Logged out successfully.');
        } catch (error) {
            console.error('[AuthService] Logout error:', error);
            throw error;
        }
    },

    /**
     * Get local user session if exists
     */
    checkSession: async () => {
        if (typeof window !== 'undefined') {
            try {
                const client = await getSpaClient();
                const isAuthenticated = await client.isAuthenticated();
                if (isAuthenticated) {
                    const user = await client.getUser();
                    const accessToken = await client.getTokenSilently();
                    return {
                        user: {
                            id: user.sub,
                            name: user.name || user.nickname || 'Cosmic Traveler',
                            email: user.email,
                            picture: user.picture,
                        },
                        accessToken,
                    };
                }
            } catch (e) {
                console.log('[AuthService] No active session found on web');
            }
        }
        return null;
    }
};

