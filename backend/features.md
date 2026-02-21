# 🔮 Falfora - Gelecek Özellikler & Geçiş Planları

---

## 1. Auth Sistemi: `react-native-auth0` → `expo-auth-session` Geçişi

### Neden Geçiş Yapmalıyız?

| Sorun | Açıklama |
|-------|----------|
| **Web desteği yok** | `react-native-auth0` sadece Android/iOS'ta çalışır. Web'de `TurboModuleRegistry` hatası verir. |
| **Native bağımlılık** | Her değişiklikte `npx expo prebuild --clean` + yeniden build gerekir. Geliştirme süreci yavaşlar. |
| **Platform ayrımı** | Web ve mobil için ayrı auth kodu yazmak gerekir, bakımı zorlaşır. |

### `expo-auth-session` Avantajları

- ✅ **Tek kod** → Android, iOS ve Web'de aynı kod çalışır
- ✅ **Prebuild gerektirmez** → Expo Go'da bile test edilebilir
- ✅ **Auth0 uyumlu** → Auth0 ile sorunsuz çalışır
- ✅ **Daha hafif** → Native modül bağımlılığı yok

---

### Geçiş Adımları

#### Adım 1: Kütüphaneleri Kur
```bash
cd frontend
npx expo install expo-auth-session expo-web-browser expo-crypto
npm uninstall react-native-auth0
```

#### Adım 2: `app.json`'dan Plugin'i Kaldır
```json
// ÖNCE (kaldır):
"plugins": [
  "@react-native-community/datetimepicker",
  ["react-native-auth0", { "domain": "..." }]
]

// SONRA:
"plugins": [
  "@react-native-community/datetimepicker"
]
```

> Not: `scheme` ayarı kalmalı, `expo-auth-session` da bunu kullanır.

#### Adım 3: `services/auth.js` Dosyasını Güncelle

```javascript
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Web için gerekli
WebBrowser.maybeCompleteAuthSession();

const AUTH0_DOMAIN = 'dev-73wqskgqn01eddi4.us.auth0.com';
const AUTH0_CLIENT_ID = 'eMwEpuHCKe9U6kisk4WbHHNrQIsLfWqG';
const AUTH0_AUDIENCE = 'https://tarot-api';

const discovery = {
    authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
    tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
    revocationEndpoint: `https://${AUTH0_DOMAIN}/oauth/revoke`,
};

// Redirect URI (otomatik platform algılar)
const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'com.falfora.app',
});

export const AuthService = {
    // useAuthRequest hook'u kullanılacak (React hook olduğu için
    // LoginScreen component'inde çağrılmalı)
    getAuthConfig: () => ({
        clientId: AUTH0_CLIENT_ID,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        extraParams: {
            audience: AUTH0_AUDIENCE,
        },
    }),

    discovery,

    // ID Token'dan kullanıcı bilgisi çıkar
    parseIdToken: (idToken) => {
        const payload = JSON.parse(
            atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        return {
            id: payload.sub,
            name: payload.name || payload.nickname || 'Cosmic Traveler',
            email: payload.email,
            picture: payload.picture,
        };
    },

    // Token exchange (authorization code → access token)
    exchangeCode: async (code) => {
        const tokenResult = await AuthSession.exchangeCodeAsync(
            {
                clientId: AUTH0_CLIENT_ID,
                code,
                redirectUri,
                extraParams: { code_verifier: '...' }, // PKCE
            },
            discovery
        );
        return tokenResult;
    },

    logout: async () => {
        // Web browser'da Auth0 logout URL'ine yönlendir
        await WebBrowser.openAuthSessionAsync(
            `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${redirectUri}`,
            redirectUri
        );
    },
};
```

#### Adım 4: `LoginScreen.js`'i Güncelle

```javascript
import { useAuthRequest } from 'expo-auth-session';
import { AuthService } from '../services/auth';

export default function LoginScreen({ onLoginSuccess }) {
    const [request, response, promptAsync] = useAuthRequest(
        AuthService.getAuthConfig(),
        AuthService.discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            // code ile token exchange yap
            // sonra onLoginSuccess çağır
        }
    }, [response]);

    return (
        // ... mevcut UI korunur
        <TouchableOpacity onPress={() => promptAsync()}>
            <Text>Enter the Cosmos</Text>
        </TouchableOpacity>
    );
}
```

#### Adım 5: Auth0 Dashboard Güncellemesi

**Allowed Callback URLs**'e web redirect URI'ı da ekle:
```
com.falfora.app.auth0://dev-73wqskgqn01eddi4.us.auth0.com/android/com.falfora.app/callback,
https://auth.expo.io/@kullanici-adi/falfora,
http://localhost:8081
```

#### Adım 6: Prebuild Temizliği
```bash
cd frontend
npx expo prebuild --clean
```

---

### Auth0 Dashboard Bilgileri (Referans)
- **Domain:** `dev-73wqskgqn01eddi4.us.auth0.com`
- **Client ID:** `eMwEpuHCKe9U6kisk4WbHHNrQIsLfWqG`
- **API Audience:** `https://tarot-api`

---

### Test Kontrol Listesi
- [ ] Android'de login çalışıyor
- [ ] Web'de login çalışıyor
- [ ] Token ile API çağrıları çalışıyor
- [ ] Logout her iki platformda çalışıyor
- [ ] Mevcut fal geçmişi korunuyor

---

## 2. Diğer Planlanan Özellikler

- [ ] Sunucu taraflı fal geçmişi (AsyncStorage → PostgreSQL/MongoDB)
- [ ] Kullanıcı profil fotoğrafı (Auth0'dan çekilebilir)
- [ ] Push notification (günlük fal hatırlatması)
- [ ] Uygulama ikonu ve splash screen özelleştirmesi
- [ ] iOS App Store & Google Play Store yayını
