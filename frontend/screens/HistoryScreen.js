import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DatabaseService } from '../services/database';

export default function HistoryScreen({ user, onNavigate, onSelectReading }) {
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const readings = await DatabaseService.getReadings(user.id);
        setHistoryItems(readings);
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleClearHistory = () => {
        Alert.alert(
            "Geçmişi Temizle",
            "Tüm kozmik kayıtları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Hepsini Sil",
                    style: "destructive",
                    onPress: async () => {
                        await DatabaseService.clearReadings(user.id);
                        setHistoryItems([]);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ width: 40 }} />
                <Text style={styles.headerTitle}>Kozmik Kayıtlar</Text>
                {historyItems.length > 0 ? (
                    <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
                        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} />
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#d4af37" />
                    </View>
                ) : historyItems.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <MaterialCommunityIcons name="book-outline" size={80} color="rgba(212, 175, 55, 0.2)" />
                        </View>
                        <Text style={styles.emptyTitle}>Henüz Kozmik Kayıt Yok</Text>
                        <Text style={styles.emptySubtitle}>Gelecek fallarınız göksel arşivlerde burada saklanacak.</Text>

                        <TouchableOpacity
                            style={styles.startReadingButton}
                            onPress={() => onNavigate('home')}
                        >
                            <LinearGradient
                                colors={['#d4af37', '#b8860b']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.buttonText}>Fal Bak</Text>
                                <MaterialCommunityIcons name="auto-fix" size={20} color="#1c1022" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {historyItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.historyCard}
                                onPress={() => onSelectReading(item)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.typeTag}>
                                        <MaterialCommunityIcons
                                            name={item.type === '10_cards' ? 'star-shooting' : 'cards-playing-outline'}
                                            size={16}
                                            color="#d4af37"
                                        />
                                        <Text style={styles.typeText}>{item.typeName}</Text>
                                    </View>
                                    <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                                </View>

                                <Text style={styles.outcomeText} numberOfLines={2}>
                                    {item.cards.join(', ')}
                                </Text>

                                <Text style={styles.readingPreview} numberOfLines={3}>
                                    {item.reading}
                                </Text>

                                <View style={styles.cardFooter}>
                                    <MaterialCommunityIcons name="arrow-right" size={20} color="#d4af37" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIndicator} />
                    <MaterialCommunityIcons name="history" size={26} color="#d4af37" />
                    <Text style={styles.navTextActive}>Geçmiş</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('home')}>
                    <MaterialCommunityIcons name="home-outline" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Ana Sayfa</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('profile')}>
                    <MaterialCommunityIcons name="account-outline" size={26} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.navText}>Profil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1022',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        marginBottom: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        flex: 1,
        textAlign: 'center',
    },
    clearButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        paddingTop: 10,
    },
    historyCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 6,
    },
    typeText: {
        color: '#d4af37',
        fontSize: 12,
        fontWeight: 'bold',
    },
    dateText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 11,
    },
    outcomeText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    readingPreview: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
    },
    viewMoreText: {
        display: 'none',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 60,
    },
    emptyIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    emptySubtitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    startReadingButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    buttonText: {
        color: '#1c1022',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(28, 16, 34, 0.98)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    navItemActive: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    navText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 11,
        fontWeight: '500',
    },
    navTextActive: {
        color: '#d4af37',
        fontSize: 11,
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        top: -12,
        width: 40,
        height: 3,
        backgroundColor: '#d4af37',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    }
});

