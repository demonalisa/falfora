import { Platform } from 'react-native';
import Auth0 from 'react-native-auth0';
import * as Linking from 'expo-linking';
// Web-only imports will be lazy-required to prevent native crashes
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH0_DOMAIN = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = process.env.EXPO_PUBLIC_AUTH0_AUDIENCE;
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Original native configuration
const auth0Native = new Auth0({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID
});

let spaClient = null;

const getSpaClient = async () => {
    if (spaClient) return spaClient;

    // URL'deki query string'leri temizleyerek ham yolu (path) alır ve her zaman '/' ile bitmesini sağlarız
    const redirectUri = Platform.OS === 'web' && typeof window !== 'undefined'
        ? (window.location.origin + window.location.pathname).split('?')[0].replace(/\/$/, '') + '/'
        : '';

    // Lazy-require web client to prevent native crashes
    const { createAuth0Client } = require('@auth0/auth0-spa-js');
    spaClient = await createAuth0Client({
        domain: AUTH0_DOMAIN,
        clientId: AUTH0_CLIENT_ID,
        authorizationParams: {
            audience: AUTH0_AUDIENCE,
            scope: 'openid profile email',
            redirect_uri: redirectUri,
            connection: 'google-oauth2',
            prompt: 'login select_account' // En güçlü kombinasyon: Girişi ve seçimi zorlar
        },
        cacheLocation: 'localstorage',
        useRefreshTokens: true
    });
    return spaClient;
};

// Helper: Save local session
const saveLocalSession = async (user, token) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
    } catch (e) {
        console.error('Save session error:', e);
    }
};

export const AuthService = {
    /**
     * Sync Auth0 User with Backend & Get Local JWT
     */
    syncGoogleUser: async (auth0User) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: auth0User.email,
                    username: auth0User.name || auth0User.nickname,
                    sub: auth0User.id
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Sync failed');

            const user = { 
                id: data._id, 
                name: data.username, 
                email: data.email, 
                picture: auth0User.picture,
                birthDate: data.birthDate,
                zodiac: data.zodiac,
                gender: data.gender,
                relationship: data.relationship,
                isProfileComplete: data.isProfileComplete
            };
            await saveLocalSession(user, data.token);
            return { user, accessToken: data.token };
        } catch (error) {
            console.error('[AuthService] Sync error:', error);
            throw error;
        }
    },

    /**
     * Login with Auth0 (Google button)
     */
    loginWithAuth0: async () => {
        try {
            if (Platform.OS === 'web') {
                const client = await getSpaClient();
                // Pop-up yerine güvenli yönlendirme (Redirect) kullanıyoruz
                await client.loginWithRedirect({
                    authorizationParams: {
                        connection: 'google-oauth2',
                        prompt: 'login select_account' // Web Redirect için giriş ve seçim zorlama
                    }
                });
                return null; // Yönlendirme olduğu için fonksiyon burada durur
            } else {
                const redirectUri = Linking.createURL('callback');
                const credentials = await auth0Native.webAuth.authorize({
                    scope: 'openid profile email',
                    audience: AUTH0_AUDIENCE,
                    redirectUri,
                    connection: 'google-oauth2',
                    prompt: 'login select_account' // Telefon için giriş ve seçim zorlama
                });
                const idToken = credentials.idToken;
                const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
                const auth0User = {
                    id: payload.sub,
                    name: payload.name || payload.nickname,
                    email: payload.email,
                    picture: payload.picture
                };
                return await AuthService.syncGoogleUser(auth0User);
            }
        } catch (error) {
            console.error('[AuthService] Auth0 Login error:', error);
            throw error;
        }
    },

    /**
     * Handle the redirect back from Auth0
     */
    handleRedirectCallback: async () => {
        if (Platform.OS === 'web') {
            const client = await getSpaClient();
            const result = await client.handleRedirectCallback();
            const user = await client.getUser();
            const auth0User = {
                id: user.sub,
                name: user.name || user.nickname,
                email: user.email,
                picture: user.picture
            };
            return await AuthService.syncGoogleUser(auth0User);
        }
        return null;
    },

    logout: async () => {
        try {
            // Local cleanup
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');

            if (Platform.OS === 'web') {
                const client = await getSpaClient();
                const returnTo = window.location.origin + (window.location.pathname.startsWith('/falfora') ? '/falfora/' : '/');
                await client.logout({ logoutParams: { returnTo } });
            } else {
                const returnTo = Linking.createURL('');
                await auth0Native.webAuth.clearSession({ returnTo });
            }
        } catch (error) {
            console.error('[AuthService] Logout error:', error);
        }
    },

    checkSession: async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('token');
            if (userStr && token) {
                return { user: JSON.parse(userStr), accessToken: token };
            }
        } catch (e) {
            console.log('[AuthService] Session check error:', e);
        }
        return null;
    }
};
