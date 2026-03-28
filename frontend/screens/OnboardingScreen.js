import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Platform, Alert, Modal, Animated } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ZODIAC_SIGNS = [
    { name: 'Koç', icon: 'zodiac-aries' },
    { name: 'Boğa', icon: 'zodiac-taurus' },
    { name: 'İkizler', icon: 'zodiac-gemini' },
    { name: 'Yengeç', icon: 'zodiac-cancer' },
    { name: 'Aslan', icon: 'zodiac-leo' },
    { name: 'Başak', icon: 'zodiac-virgo' },
    { name: 'Terazi', icon: 'zodiac-libra' },
    { name: 'Akrep', icon: 'zodiac-scorpio' },
    { name: 'Yay', icon: 'zodiac-sagittarius' },
    { name: 'Oğlak', icon: 'zodiac-capricorn' },
    { name: 'Kova', icon: 'zodiac-aquarius' },
    { name: 'Balık', icon: 'zodiac-pisces' },
];

export default function OnboardingScreen({ onComplete, onBack }) {
    const [birthDate, setBirthDate] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedZodiac, setSelectedZodiac] = useState('Aslan');
    const [relationshipStatus, setRelationshipStatus] = useState('İlişkisi Var');
    const [showZodiacScrollHint, setShowZodiacScrollHint] = useState(true);
    const [dateError, setDateError] = useState(false);
    const [zodiacWarning, setZodiacWarning] = useState(null);
    const webDateInputRef = useRef(null);

    const calculateZodiac = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const day = d.getDate();

        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Koç';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Boğa';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'İkizler';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Yengeç';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Aslan';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Başak';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Terazi';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Akrep';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Yay';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Oğlak';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Kova';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Balık';
        return null;
    };

    useEffect(() => {
        if (birthDate) {
            const calculated = calculateZodiac(birthDate);
            if (calculated && calculated !== selectedZodiac) {
                setZodiacWarning(calculated);
            } else {
                setZodiacWarning(null);
            }
        }
    }, [birthDate, selectedZodiac]);

    // Animation for the scroll hint arrow
    const bobAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showZodiacScrollHint) {
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(bobAnim, {
                        toValue: 8,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bobAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
            return () => animation.stop();
        }
    }, [showZodiacScrollHint]);

    const onZodiacScroll = (event) => {
        if (event.nativeEvent.contentOffset.x > 10 && showZodiacScrollHint) {
            setShowZodiacScrollHint(false);
        }
    };

    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            if (selectedDate) {
                setBirthDate(selectedDate);
                setDateError(false);
            }
        } else {
            if (selectedDate) setTempDate(selectedDate);
        }
    };

    const handleConfirmDate = () => {
        setBirthDate(tempDate);
        setDateError(false);
        setShowDatePicker(false);
    };

    const formatDate = (date) => {
        if (!date) return 'Gün / Ay / Yıl';
        const d = new Date(date);
        return `${d.getDate()} / ${d.getMonth() + 1} / ${d.getFullYear()}`;
    };

    const handleContinue = () => {
        if (!birthDate) {
            setDateError(true);
            return;
        }
        onComplete({
            birthDate: birthDate.toISOString(),
            zodiac: selectedZodiac,
            relationship: relationshipStatus
        });
    };

    return (
        <View style={styles.onboardingContainer}>
            {/* Top Bar for Onboarding */}
            <View style={styles.onboardingHeader}>
                <View style={{ width: 44 }} />
                <Text style={styles.onboardingHeaderTitle}>Kullanıcı Bilgileri</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.onboardingScroll}>
                {/* Headline */}
                <View style={styles.onboardingHeadline}>
                    <Text style={styles.onboardingTitle}>Göksel Uyum</Text>
                    <Text style={styles.onboardingSubtitle}>Yıldızların yolunuzu aydınlatması için kendinizi tanıtın.</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Birth Date */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Doğum Tarihi *</Text>
                        <TouchableOpacity
                            style={styles.textInputWrapper}
                            onPress={() => {
                                if (Platform.OS !== 'web') {
                                    setShowDatePicker(true);
                                } else if (webDateInputRef.current) {
                                    // Modern way to show native picker on web
                                    try {
                                        if (typeof webDateInputRef.current.showPicker === 'function') {
                                            webDateInputRef.current.showPicker();
                                        } else {
                                            webDateInputRef.current.click();
                                        }
                                    } catch (e) {
                                        webDateInputRef.current.click();
                                    }
                                }
                            }}
                            activeOpacity={Platform.OS === 'web' ? 0.6 : 0.7}
                        >
                            <View style={[styles.textInput, dateError && styles.textInputError]}>
                                <Text style={[styles.dateText, !birthDate && styles.placeholderText]}>
                                    {formatDate(birthDate)}
                                </Text>
                            </View>
                            <MaterialIcons name="calendar-today" size={20} color="#d4af37" style={styles.inputIcon} />
                            
                            {/* Web-specific native date picker (hidden) */}
                            {Platform.OS === 'web' && (
                                <input
                                    ref={webDateInputRef}
                                    type="date"
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        opacity: 0,
                                        width: 0,
                                        height: 0,
                                        pointerEvents: 'none'
                                    }}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        if (!isNaN(date.getTime())) {
                                            setBirthDate(date);
                                            setDateError(false);
                                        }
                                    }}
                                />
                            )}
                        </TouchableOpacity>

                        {/* iOS Date Picker Modal */}
                        {Platform.OS === 'ios' && (
                            <Modal
                                transparent={true}
                                animationType="slide"
                                visible={showDatePicker}
                            >
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContent}>
                                        <View style={styles.modalHeader}>
                                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                                <Text style={styles.modalCancelText}>İptal</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={handleConfirmDate}>
                                                <Text style={styles.modalDoneText}>Onayla</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <DateTimePicker
                                            value={tempDate}
                                            mode="date"
                                            display="spinner"
                                            onChange={onDateChange}
                                            maximumDate={new Date()}
                                            textColor="white"
                                        />
                                    </View>
                                </View>
                            </Modal>
                        )}

                        {/* Android Date Picker */}
                        {Platform.OS === 'android' && showDatePicker && (
                            <DateTimePicker
                                value={birthDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                            />
                        )}

                        {dateError && (
                            <Text style={styles.errorText}>Lütfen yıldızlarla uyumlanmak için doğum tarihinizi seçin.</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.inputLabel}>Burç</Text>
                        </View>

                        {zodiacWarning && (
                            <View style={styles.warningBox}>
                                <View style={styles.warningHeader}>
                                    <MaterialCommunityIcons name="star-shooting" size={16} color="#d4af37" />
                                    <Text style={styles.warningTitle}>Kozmik Uyarı</Text>
                                </View>
                                <Text style={styles.warningText}>
                                    Seçtiğiniz tarihe göre burcunuz <Text style={styles.warningSpan}>{zodiacWarning}</Text> olarak görünüyor.
                                    Yine de kendinizi seçtiğiniz burca daha yakın hissediyorsanız devam edebilirsiniz.
                                </Text>
                            </View>
                        )}

                        <View style={styles.zodiacScrollWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.zodiacScrollContent}
                                onScroll={onZodiacScroll}
                                scrollEventThrottle={16}
                            >
                                {ZODIAC_SIGNS.map((item) => (
                                    <TouchableOpacity
                                        key={item.name}
                                        onPress={() => setSelectedZodiac(item.name)}
                                        style={[
                                            styles.zodiacCard,
                                            selectedZodiac === item.name && styles.zodiacCardSelected,
                                        ]}
                                    >
                                        <MaterialCommunityIcons
                                            name={item.icon}
                                            size={32}
                                            color={selectedZodiac === item.name ? '#d4af37' : 'rgba(255, 255, 255, 0.5)'}
                                        />
                                        <Text
                                            style={[
                                                styles.zodiacName,
                                                selectedZodiac === item.name ? styles.zodiacNameActive : styles.zodiacNameInactive,
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {showZodiacScrollHint && (
                                <Animated.View
                                    style={[
                                        styles.scrollHint,
                                        { transform: [{ translateX: bobAnim }] }
                                    ]}
                                    pointerEvents="none"
                                >
                                    <MaterialIcons name="chevron-right" size={32} color="white" />
                                </Animated.View>
                            )}
                        </View>
                    </View>

                    {/* Relationship Status */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>İlişki Durumu</Text>
                        <View style={styles.pillGroup}>
                            {['Bekar', 'İlişkisi Var', 'Evli', 'Karışık'].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => setRelationshipStatus(status)}
                                    style={[
                                        styles.pillButton,
                                        relationshipStatus === status && styles.pillButtonActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.pillText,
                                            relationshipStatus === status && styles.pillTextActive,
                                        ]}
                                    >
                                        {status}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View style={styles.onboardingFooter}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueButtonText}>Devam Et</Text>
                    <MaterialCommunityIcons name="auto-fix" size={22} color="#1c1022" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    onboardingContainer: {
        flex: 1,
    },
    onboardingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backIconButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    onboardingHeaderTitle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        flex: 1,
        textAlign: 'center',
    },
    onboardingScroll: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#d4af37',
        borderRadius: 3,
    },
    onboardingHeadline: {
        alignItems: 'center',
        marginBottom: 32,
    },
    onboardingTitle: {
        color: 'white',
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    onboardingSubtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 22,
    },
    formContainer: {
        gap: 32,
    },
    inputGroup: {
        gap: 12,
    },
    inputLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    textInputWrapper: {
        position: 'relative',
        height: 56,
    },
    textInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        right: 16,
        top: 18,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    autoDetect: {
        color: '#d4af37',
        fontSize: 12,
        fontWeight: '500',
    },
    zodiacScrollWrapper: {
        position: 'relative',
        height: 100,
    },
    zodiacScrollContent: {
        flexDirection: 'row',
        gap: 12,
        paddingRight: 40, // Increased padding to avoid arrow overlap
    },
    scrollHint: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingLeft: 10,
        backgroundColor: 'transparent',
    },
    zodiacCard: {
        width: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: 0.6,
        height: 100,
    },
    zodiacCardSelected: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: '#d4af37',
        borderWidth: 2,
        opacity: 1,
    },
    zodiacName: {
        fontSize: 12,
        fontWeight: '500',
    },
    zodiacNameInactive: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    zodiacNameActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    dateText: {
        color: 'white',
        fontSize: 16,
    },
    placeholderText: {
        color: 'rgba(255, 255, 255, 0.2)',
    },
    pillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    pillButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    pillButtonActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderColor: '#d4af37',
    },
    pillText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    pillTextActive: {
        color: '#d4af37',
        fontFamily: 'Inter_700Bold',
    },
    onboardingFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: 'rgba(28, 16, 34, 0.8)',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1c1022',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalDoneText: {
        color: '#d4af37',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCancelText: {
        color: 'white',
        fontSize: 16,
    },
    continueButton: {
        backgroundColor: '#d4af37',
        height: 56,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#d4af37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        color: '#1c1022',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        marginTop: 8,
        marginLeft: 4,
    },
    textInputError: {
        borderColor: '#ff4d4d',
        backgroundColor: 'rgba(255, 77, 77, 0.05)',
    },
    warningBox: {
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        marginBottom: 16,
        marginTop: 4,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    warningTitle: {
        color: '#d4af37',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 0.5,
    },
    warningText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Inter_400Regular',
    },
    warningSpan: {
        color: '#d4af37',
        fontFamily: 'Inter_700Bold',
    },
});
