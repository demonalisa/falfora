import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Platform, Alert, Modal, Animated } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ZODIAC_SIGNS = [
    { name: 'Aries', icon: 'zodiac-aries' },
    { name: 'Taurus', icon: 'zodiac-taurus' },
    { name: 'Gemini', icon: 'zodiac-gemini' },
    { name: 'Cancer', icon: 'zodiac-cancer' },
    { name: 'Leo', icon: 'zodiac-leo' },
    { name: 'Virgo', icon: 'zodiac-virgo' },
    { name: 'Libra', icon: 'zodiac-libra' },
    { name: 'Scorpio', icon: 'zodiac-scorpio' },
    { name: 'Sagittarius', icon: 'zodiac-sagittarius' },
    { name: 'Capricorn', icon: 'zodiac-capricorn' },
    { name: 'Aquarius', icon: 'zodiac-aquarius' },
    { name: 'Pisces', icon: 'zodiac-pisces' },
];

export default function OnboardingScreen({ onComplete, onBack }) {
    const [birthDate, setBirthDate] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedZodiac, setSelectedZodiac] = useState('Leo');
    const [relationshipStatus, setRelationshipStatus] = useState('In a Relationship');
    const [showZodiacScrollHint, setShowZodiacScrollHint] = useState(true);

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
            if (selectedDate) setBirthDate(selectedDate);
        } else {
            if (selectedDate) setTempDate(selectedDate);
        }
    };

    const handleConfirmDate = () => {
        setBirthDate(tempDate);
        setShowDatePicker(false);
    };

    const formatDate = (date) => {
        if (!date) return 'MM / DD / YYYY';
        const d = new Date(date);
        return `${d.getMonth() + 1} / ${d.getDate()} / ${d.getFullYear()}`;
    };

    const handleContinue = () => {
        if (!birthDate) {
            Alert.alert("Required", "Please select your birth date to align with the stars.");
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
                <Text style={styles.onboardingHeaderTitle}>User Information</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.onboardingScroll}>
                {/* Headline */}
                <View style={styles.onboardingHeadline}>
                    <Text style={styles.onboardingTitle}>Celestial Alignment</Text>
                    <Text style={styles.onboardingSubtitle}>Let the stars know who you are to unveil your cosmic path.</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Birth Date */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Birth Date *</Text>
                        <TouchableOpacity
                            style={styles.textInputWrapper}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <View style={styles.textInput}>
                                <Text style={[styles.dateText, !birthDate && styles.placeholderText]}>
                                    {formatDate(birthDate)}
                                </Text>
                            </View>
                            <MaterialIcons name="calendar-today" size={20} color="#d4af37" style={styles.inputIcon} />
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
                                                <Text style={styles.modalCancelText}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={handleConfirmDate}>
                                                <Text style={styles.modalDoneText}>Confirm</Text>
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
                    </View>

                    {/* Zodiac grid (Now scrollable) */}
                    <View style={styles.inputGroup}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.inputLabel}>Zodiac Sign</Text>
                        </View>
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
                        <Text style={styles.inputLabel}>Relationship Status</Text>
                        <View style={styles.pillGroup}>
                            {['Single', 'In a Relationship', 'Married', 'Complicated'].map((status) => (
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
                    <Text style={styles.continueButtonText}>Continue</Text>
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
        fontWeight: 'bold',
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
        fontWeight: 'bold',
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
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    onboardingSubtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
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
        fontWeight: 'bold',
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
    },
    pillTextActive: {
        color: '#d4af37',
        fontWeight: 'bold',
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
        fontWeight: 'bold',
    },
});
