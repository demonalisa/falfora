import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen({ onGoogleLogin, onAppleLogin, onFacebookLogin }) {
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
                    Unveil Your <Text style={styles.accentText}>Destiny</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Connect your spirit to the cosmic energy and reveal what the stars have written for you.
                </Text>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.buttonWhite} onPress={onGoogleLogin}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfpcbC9Xb4CYitqFr9mJ_QxaBJPnz7fttV0QZ1zfh-3k2cj1O8WCZ0kUD0s6_ytAhkuBpcEdMjPWn5u_UyqY-e8r_V_xHdqFphHBpsJa8fXaMUc_iF73thY0_UjQMDwMxHNtcsVXkQg_kGgrkVdJzuuqbWxLKkFFeFL2akwU0Xt4omBVsPCMXyG1VxzLjRy_CzWEOV-5PaMP3rg3EYBTH5eld_wKrDBQtQHlZsiJvuhcgYDuzC5moQTO84zasOjf36cgtcwMD_g9Qn" }}
                        style={styles.googleIcon}
                    />
                    <Text style={styles.buttonTextDark}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonBlack} onPress={onAppleLogin}>
                    <FontAwesome name="apple" size={24} color="white" />
                    <Text style={styles.buttonTextWhite}>Continue with Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonBlue} onPress={onFacebookLogin}>
                    <FontAwesome name="facebook" size={20} color="white" />
                    <Text style={styles.buttonTextWhite}>Continue with Facebook</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    By entering the cosmos, you agree to our{'\n'}
                    <Text style={styles.linkText}>Terms of Transcendence</Text> and <Text style={styles.linkText}>Spiritual Privacy Policy</Text>.
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
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: 10,
    },
    accentText: {
        color: '#d4af37',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    buttonGroup: {
        paddingHorizontal: 24,
        gap: 16,
        marginBottom: 32,
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
    },
    buttonWhite: {
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    buttonBlack: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonBlue: {
        backgroundColor: '#1877F2',
        height: 56,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    buttonTextDark: {
        color: '#120a18',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonTextWhite: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    googleIcon: {
        width: 20,
        height: 20,
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 20,
        marginTop: 'auto',
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    linkText: {
        color: 'rgba(212, 175, 55, 0.6)',
        textDecorationLine: 'underline',
    },
});
