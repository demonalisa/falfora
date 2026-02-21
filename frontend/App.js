import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseService } from './services/database';

// Screens
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ReadingScreen from './screens/ReadingScreen';
import ProfileScreen from './screens/ProfileScreen';
import HistoryScreen from './screens/HistoryScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'onboarding', 'welcome', 'home', 'reading'
  const [sessionUser, setSessionUser] = useState(null); // { id: string, name: string }
  const [selectedFortuneType, setSelectedFortuneType] = useState(null);
  const [selectedReading, setSelectedReading] = useState(null);

  const [userInfo, setUserInfo] = useState(null);

  const checkUserAndNavigate = async (user) => {
    setSessionUser(user);
    const existingUser = await DatabaseService.getUser(user.id);
    if (existingUser) {
      setUserInfo(existingUser);
      setCurrentScreen('home');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleGoogleLogin = () => {
    console.log('DEBUG: Google Login Pressed');
    const mockUser = { id: 'google_mock_user', name: 'Cosmic Traveler' };
    checkUserAndNavigate(mockUser);
  };

  const handleAppleLogin = () => {
    console.log('DEBUG: Apple Login Pressed');
    const mockUser = { id: 'apple_mock_user', name: 'Celestial Being' };
    checkUserAndNavigate(mockUser);
  };

  const handleFacebookLogin = () => {
    console.log('DEBUG: Facebook Login Pressed');
    const mockUser = { id: 'fb_mock_user', name: 'Star Dreamer' };
    checkUserAndNavigate(mockUser);
  };

  const handleOnboardingComplete = async (userData) => {
    if (sessionUser) {
      const savedUser = await DatabaseService.saveUser(sessionUser.id, userData);
      setUserInfo(savedUser);
      setCurrentScreen('welcome');
    }
  };

  const handleWelcomeComplete = () => {
    setCurrentScreen('home');
  };

  const handleNavigate = (screen) => {
    setSelectedReading(null);
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    setSessionUser(null);
    setUserInfo(null);
    setSelectedReading(null);
    setCurrentScreen('login');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Global Background Layer */}
        <View style={styles.backgroundLayer}>
          <View style={styles.purpleBlob} />
          <View style={styles.goldBlob} />
          <LinearGradient
            colors={['transparent', 'rgba(28, 16, 34, 0.8)', '#1c1022']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <SafeAreaView style={styles.safeArea}>
          {currentScreen === 'login' && (
            <LoginScreen
              onGoogleLogin={handleGoogleLogin}
              onAppleLogin={handleAppleLogin}
              onFacebookLogin={handleFacebookLogin}
            />
          )}
          {currentScreen === 'onboarding' && (
            <OnboardingScreen
              onComplete={handleOnboardingComplete}
              onBack={() => setCurrentScreen('login')}
            />
          )}
          {currentScreen === 'welcome' && (
            <WelcomeScreen
              user={sessionUser}
              onStart={handleWelcomeComplete}
            />
          )}
          {currentScreen === 'home' && (
            <HomeScreen
              user={sessionUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              onReadFortune={(type) => {
                setSelectedFortuneType(type);
                setSelectedReading(null);
                setCurrentScreen('reading');
              }}
            />
          )}
          {currentScreen === 'reading' && (
            <ReadingScreen
              user={sessionUser}
              userInfo={userInfo}
              selectedType={selectedFortuneType}
              existingReading={selectedReading}
              onBack={() => setCurrentScreen(selectedReading ? 'history' : 'home')}
              onNavigate={handleNavigate}
            />
          )}
          {currentScreen === 'profile' && (
            <ProfileScreen
              user={sessionUser}
              userInfo={userInfo}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          )}
          {currentScreen === 'history' && (
            <HistoryScreen
              user={sessionUser}
              onNavigate={handleNavigate}
              onSelectReading={(reading) => {
                setSelectedReading(reading);
                setSelectedFortuneType(reading.type);
                setCurrentScreen('reading');
              }}
            />
          )}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1022',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  purpleBlob: {
    position: 'absolute',
    top: 50,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(164, 19, 236, 0.2)',
  },
  goldBlob: {
    position: 'absolute',
    bottom: 150,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  safeArea: {
    flex: 1,
  },
});
