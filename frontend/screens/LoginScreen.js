import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthService } from '../services/auth';

export default function LoginScreen({ onLoginSuccess, onDevLogin }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await AuthService.loginWithAuth0();
            if (result && result.user) {
                onLoginSuccess(result.user, result.accessToken);
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError('Google girişi şu an gerçekleştirilemiyor.');
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.heroContainer}>
                <View style={styles.crystalBallWrapper}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAuyu6DePslE1BLvOEYVr6gqtaAN-J6srLYnXuACv-E29pAFSZ3XxDW_Dvuu8YXMJZQaiQPp1VfrKjXT1WHXKGhnygAqHeT6kW8r7wu9V8YgpUNw-vpPkHmdBPUe1xOJjJf0xyiomNNHCHPyRccCxQDS7_kNizMuWrJkyxa-gsHJexI3sN4ju5-J4MRVogjzYgXOr6TKMweHds26PImWtEMcqTN4CPsRzvPCrDXhaTYqookpmt46xuffyET6gvuT5h_wS4OwwYwVFM" }}
                        style={styles.crystalBallImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', '#120a18']}
                        style={styles.imageOverlay}
                        locations={[0.5, 1]}
                    />
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.mainTitle}>
                    Kaderinizi <Text style={styles.accentText}>Keşfedin</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Ruhunuzu kozmik enerjiye bağlayın ve yıldızların sizin için ne yazdığını keşfedin.
                </Text>
            </View>

            <View style={styles.buttonGroup}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={[styles.googleButton, loading && { pointerEvents: 'none' }]}
                    onPress={handleGoogleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#d4af37', '#b8860b']}
                        style={styles.loginGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#1c1022" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="google" size={24} color="#1c1022" />
                                <Text style={styles.loginButtonText}>Google ile Devam Et</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {__DEV__ && (
                    <TouchableOpacity 
                        style={styles.devSkipButton} 
                        onPress={() => onDevLogin()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.devSkipText}>Geliştirici Girişi (Hızlı Test)</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Evrene girerek şunları kabul etmiş olursunuz:{'\n'}
                    <Text style={styles.linkText}>Yüceliş Şartları</Text> ve <Text style={styles.linkText}>Gizlilik Politikası</Text>.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 40,
    },
    heroContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    crystalBallWrapper: {
        width: 260,
        height: 260,
        borderRadius: 130,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        backgroundColor: 'rgba(164, 19, 236, 0.05)',
    },
    crystalBallImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    textContainer: {
        paddingHorizontal: 32,
        alignItems: 'center',
        marginBottom: 50,
    },
    mainTitle: {
        color: '#fff',
        fontSize: Platform.OS === 'web' ? 42 : 34,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    accentText: {
        color: '#d4af37',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonGroup: {
        paddingHorizontal: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    googleButton: {
        width: '100%',
        height: 58,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(212, 175, 55, 0.3)',
    },
    loginGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loginButtonText: {
        color: '#1c1022',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 14,
        marginBottom: 16,
        fontFamily: 'Inter_500Medium',
    },
    footer: {
        paddingHorizontal: 32,
        marginTop: 60,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 18,
    },
    linkText: {
        color: 'rgba(212, 175, 55, 0.6)',
        textDecorationLine: 'underline',
    },
    devSkipButton: {
        marginTop: 20,
        padding: 8,
    },
    devSkipText: {
        color: '#d4af37',
        fontSize: 12,
        textDecorationLine: 'underline',
        opacity: 0.6,
    },
});
