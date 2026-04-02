import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { DatabaseService } from './services/database';
import { AuthService } from './services/auth';

// Screens
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ReadingScreen from './screens/ReadingScreen';
import ProfileScreen from './screens/ProfileScreen';
import HistoryScreen from './screens/HistoryScreen';
import CardSelectionScreen from './screens/CardSelectionScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'onboarding', 'welcome', 'home', 'selection', 'reading'
  const [sessionUser, setSessionUser] = useState(null); // { id: string, name: string }
  const [selectedFortuneType, setSelectedFortuneType] = useState(null);
  const [manualSelectedCards, setManualSelectedCards] = useState(null);
  const [selectedReading, setSelectedReading] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await AuthService.checkSession();
        if (session) {
          const { user, accessToken: token } = session;
          setAccessToken(token);
          await checkUserAndNavigate(user);
        }
      } catch (error) {
        console.log('[App] Session check error:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, []);

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

  const handleAuth0Login = async () => {
    try {
      const { user, accessToken: token } = await AuthService.login();
      setAccessToken(token);
      checkUserAndNavigate(user);
    } catch (error) {
      console.log('Login cancelled or failed:', error);
    }
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

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.log('Logout error:', error);
    }
    setSessionUser(null);
    setUserInfo(null);
    setAccessToken(null);
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
          {isInitializing || !fontsLoaded ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#d4af37" />
              {fontsLoaded && <Text style={{ color: '#d4af37', marginTop: 20, fontFamily: 'Inter_400Regular' }}>Evrenle uyumlanıyor...</Text>}
            </View>
          ) : (
            <>
              {currentScreen === 'login' && (
                <LoginScreen
                  onLogin={handleAuth0Login}
                  onDevLogin={() => checkUserAndNavigate({ id: 'dev_user_123', name: 'Geliştirici' })}
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
                    setManualSelectedCards(null);
                    setSelectedReading(null);
                    setCurrentScreen('selection');
                  }}
                />
              )}
              {currentScreen === 'selection' && (
                <CardSelectionScreen
                  selectedType={selectedFortuneType}
                  onBack={() => setCurrentScreen('home')}
                  onReadFortune={(type, cards) => {
                    setManualSelectedCards(cards);
                    setCurrentScreen('reading');
                  }}
                />
              )}
              {currentScreen === 'reading' && (
                <ReadingScreen
                  user={sessionUser}
                  userInfo={userInfo}
                  accessToken={accessToken}
                  selectedType={selectedFortuneType}
                  manualSelectedCards={manualSelectedCards}
                  existingReading={selectedReading}
                  onBack={() => setCurrentScreen(selectedReading ? 'history' : 'home')}
                  onNavigate={handleNavigate}
                />
              )}
              {currentScreen === 'profile' && (
                <ProfileScreen
                  user={sessionUser}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
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
            </>
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
