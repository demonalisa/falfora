import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen({ onLogin, onDevLogin }) {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await onLogin();
        } catch (error) {
            console.log('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.contentWrapper}>
            {/* Hero Image / Crystal Ball */}
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
                    Ruhunuzu kozmik enerjiye bağlayın ve yıldızların sizin için ne yazdığını ortaya çıkarın.
                </Text>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
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
                               <MaterialCommunityIcons name="login" size={22} color="#1c1022" />
                                <Text style={styles.loginButtonText}>Evrene Giriş Yap</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {__DEV__ && (
                    <TouchableOpacity 
                        style={styles.devSkipButton} 
                        onPress={onDevLogin}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.devSkipText}>Geliştirici Girişi (Auth0 Atla)</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Evrene girerek şunları kabul etmiş olursunuz:{'\n'}
                    <Text style={styles.linkText}>Yüceliş Şartları</Text> ve <Text style={styles.linkText}>Ruhsal Gizlilik Politikası</Text>.
                </Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    heroContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        paddingHorizontal: 24,
    },
    crystalBallWrapper: {
        width: 280,
        height: 280,
        borderRadius: 140,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        backgroundColor: 'rgba(164, 19, 236, 0.05)',
        shadowColor: '#a413ec',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
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
        marginBottom: 30,
    },
    mainTitle: {
        color: '#fff',
        fontSize: Platform.OS === 'web' ? 48 : 36,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
        lineHeight: Platform.OS === 'web' ? 56 : 44,
        marginBottom: 10,
    },
    accentText: {
        color: '#d4af37',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    buttonGroup: {
        paddingHorizontal: 24,
        gap: 12,
        marginBottom: 32,
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
        alignItems: 'center',
    },
    loginButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
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
    loginHint: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 13,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 20,
        marginTop: 'auto',
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
        padding: 10,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    devSkipText: {
        color: '#d4af37',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
    },
});

