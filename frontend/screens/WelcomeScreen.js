import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ user, onStart }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <View style={styles.iconWrapper}>
                    <MaterialCommunityIcons name="auto-fix" size={80} color="#d4af37" />
                    <View style={styles.glow} />
                </View>

                <Text style={styles.title}>Yıldızlar Konuştu</Text>

                <Text style={styles.message}>
                    Hoş geldin, <Text style={styles.userName}>{user?.name}</Text>.{"\n\n"}
                    Göksel haritanız artık tamamlandı. Evren sizin için kozmik içgörüler ve ruhsal gelişimle dolu benzersiz bir yol hazırladı.{"\n\n"}
                    Artık yıldızların zamanın dokusuna ne yazdığını keşfetmeye hazırsınız.
                </Text>

                <TouchableOpacity style={styles.startButton} onPress={onStart}>
                    <LinearGradient
                        colors={['#d4af37', '#b8860b']}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>Başlayalım</Text>
                        <MaterialCommunityIcons name="shimmer" size={20} color="#1c1022" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    iconWrapper: {
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        zIndex: -1,
    },
    title: {
        color: '#fff',
        fontSize: Platform.OS === 'web' ? 44 : 32,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    message: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 48,
    },
    userName: {
        color: '#d4af37',
        fontFamily: 'Outfit_700Bold',
    },
    startButton: {
        width: '100%',
        height: 56,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#d4af37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    buttonText: {
        color: '#1c1022',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
});
