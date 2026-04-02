const path = require('path');
const fs = require('fs');

// Render mounts secret files at /etc/secrets/ by default if specified.
// We check for /etc/secrets/.env first, then fallback to local .env
const secretPath = '/etc/secrets/.env';
if (fs.existsSync(secretPath)) {
    require('dotenv').config({ path: secretPath });
} else {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const { pickRandomCards } = require('./cards');
const { checkJwt } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Verify required environment variables
const requiredEnv = ['GROQ_API_KEY', 'AUTH0_DOMAIN', 'AUTH0_AUDIENCE'];
const missingEnv = requiredEnv.filter(k => !process.env[k]);

if (missingEnv.length > 0) {
    console.warn(`[WARNING] Missing environment variables: ${missingEnv.join(', ')}`);
    console.warn('Backend may not function correctly. Ensure these are set in Render (Environment or Secret Files).');
}

// Groq Configuration
if (!process.env.GROQ_API_KEY) {
    console.error('[ERROR] GROQ_API_KEY is not defined! API calls will fail.');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World from Express API!' });
});

/**
 * Tarot Reading Endpoint
 * POST /api/tarot/reading
 * Body: { 
 *   cardCount: 3 | 10, 
 *   userInfo: { name, birthDate, horoscope, gender, relationship }, 
 *   question?: string 
 * }
 */
app.post('/api/tarot/reading', checkJwt, async (req, res) => {
    console.log("starting faling")
    const { cardCount = 3, spreadName = "Genel", userInfo } = req.body;

    if (!userInfo) {
        return res.status(400).json({ error: 'User information (userInfo) is required.' });
    }

    try {
        // Kartları otomatik seçiyoruz (Eğer frontend manuel gönderdiyse oradan alıyoruz)
        const { selectedCards: manualCards } = req.body;
        const selectedCards = manualCards && Array.isArray(manualCards) ? manualCards : pickRandomCards(cardCount);
        
        const isLoveSpread = spreadName === "Aşk Açılımı";
        const isDailySpread = spreadName === "Günlük Bakış";
        const isGalacticSpread = spreadName === "Galaktik Açılım";
        const isSingleSpread = spreadName === "Günün Tavsiyesi";
        const readingType = `${cardCount} kartlık (${spreadName}) Tarot okuması`;

        const prompt = `
      Sen kadim bilgilere sahip, sezgileri çok güçlü bir Tarot Ustasısın. 
      Aşağıdaki kullanıcı için özel bir ${readingType} yapacaksın:

      Kullanıcı Bilgileri:
      - İsim: ${userInfo.name || 'Misafir'}
      - Doğum Tarihi: ${userInfo.birthDate || 'Belirtilmedi'}
      - Burç: ${userInfo.horoscope || 'Belirtilmedi'}
      - Cinsiyet: ${userInfo.gender || 'Belirtilmedi'}
      - İlişkisel Durum: ${userInfo.relationship || 'Belirtilmedi'}

      Seçilen Kartlar:
      ${selectedCards.join('\n- ')}

      ${isLoveSpread ? `
      AŞK AÇILIMI TEMALARI (7 KART):
      1. KART: Senin (Kullanıcının) derin duyguları ve mevcut ruh halin.
      2. KART: Karşı tarafın (Partnerin/Adayın) sana karşı gerçek hisleri.
      3. KART: İlişkideki mevcut enerji ve aranızdaki kozmik uyum.
      4. KART: Senin bu ilişkiden beklentin, umudun veya gizli isteğin.
      5. KART: Karşı tarafın bu ilişkiden beklentisi ve vizyonu.
      6. KART: Yolunuza çıkan bir engel, çözülmesi gereken bir düğüm veya dış bir zorluk.
      7. KART: İlişkinin yakın gelecekteki potansiyeli ve varacağı kozmik sonuç.
      ` : isDailySpread ? `
      GÜNLÜK BAKIŞ TEMALARI (3 KART):
      1. KART: Geçmişin tortuları ve bugününü etkileyen eski enerjiler.
      2. KART: Bugünün ana enerjisi, şu anki mevcut durumun.
      3. KART: Yakın gelecekte seni bekleyen potansiyel ve kozmik mesaj.
      ` : isGalacticSpread ? `
      GALAKTİK AÇILIM TEMALARI (10 KART):
      1. KART: Mevcut Durumun ve merkezin.
      2. KART: Yoluna çıkan zorluk ve engel.
      3. KART: Amaçların, dileklerin ve en iyi ihtimal.
      4. KART: Bilinçaltın, temel korkuların ve köklerin.
      5. KART: Geçmişin enerjisi, arkanda bıraktıkların.
      6. KART: Yakın gelecekte karşılaşacağın etkiler.
      7. KART: Kendi iç dünyan ve bakış açın.
      8. KART: Dış dünyadaki insanların seni nasıl gördüğü ve çevre etkileri.
      9. KART: Umutların, beklentilerin veya endişelerin.
      10. KART: Kozmik sonuç, varacağın son nokta.
      ` : isSingleSpread ? `
      GÜNÜN TAVSİYESİ TEMASI (1 KART):
      1. KART: Bugün alman gereken ana mesaj, genel tavsiye ve günün rehberlik enerjisi.
      ` : ''}

      ÖNEMLİ FORMAT VE UZUNLUK KURALI:
      Yazacağın fal metni TAM OLARAK ${cardCount + 3} paragraf uzunluğunda olmalıdır.
      Kurgun şu sırayla ilerlemelidir:
      1. Paragraf: Mistik ve etkileyici bir giriş yazısı.
      Orta Paragraflar: Seçilen her bir kart için, kartın ismini veya numarasını ASLA zikretmeden, tamamen o kartın manasını anlatan 1 paragraf (Toplam ${cardCount} paragraf).
      NOT: Orta paragraflar yukarıdaki açılım tipine göre tanımlanan temaları (Sen, O, İlişki, Geçmiş, Bugün, Gelecek, Engel vb.) sırasıyla derinlemesine işlemelidir.
      Sondan Bir Önceki Paragraf: Tüm kartların anlattıklarına yönelik genel bir özet.
      Son Paragraf: Güzel, bilgece bir kapanış ve tavsiye yazısı.

      KESİN YASAKLAR VE KURALLAR:
      1) Paragraflara YALNIZCA GÖVDE METNİ ile doğrudan giriş yap. "Giriş:", "Özet:", "1. Kart Kılıç Ası:" vb. HİÇBİR BAŞLIK ETİKETİ VEYA KART ADI YAZILMAYACAK.
      2) Geri dönüşün SADECE VE SADECE AŞAĞIDAKİ GİBİ GEÇERLİ BİR "JSON" DİZİSİ OLMALIDIR. Başında veya sonunda markdown (md) etiketleri veya yazılı metin KESİNLİKLE koyma. Sadece köşeli parantezli bir array dön.

      Örnek Beklenen Çıktı Formatı:
      [
        "Mistik giriş yazısı buraya gelecek...",
        "İlk kartın sadece yorumu buraya gelecek...",
        "İkinci kartın sadece yorumu buraya gelecek...",
        "Falın özeti buraya gelecek...",
        "Kapanış tavsiyesi buraya gelecek..."
      ]
    `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Sen kadim bilgilere sahip, sezgileri çok güçlü bir Tarot Ustasısın. Kullanıcıya mistik ve etkileyici tarot falı yorumları yaparsın. Yanıtlarını HER ZAMAN ve SADECE TÜRKÇE dilinde verirsin. Kesinlikle başka dillerden (Çince, İngilizce vb.) karakterler veya kelimeler kullanma. Yanıtlarını her zaman geçerli JSON formatında döndürürsün.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.9,
            max_tokens: 4096,
            response_format: { type: 'json_object' }
        });

        const text = chatCompletion.choices[0]?.message?.content || '[]';

        let slidesArray;
        try {
            const parsed = JSON.parse(text);
            // Groq json_object mode wraps in an object, extract the array
            slidesArray = Array.isArray(parsed) ? parsed : (parsed.reading || parsed.paragraphs || parsed.slides || Object.values(parsed)[0]);
            if (!Array.isArray(slidesArray)) {
                slidesArray = [text];
            }
        } catch (e) {
            console.error('JSON Parse Error, falling back to string:', e, text);
            slidesArray = [text];
        }

        res.json({
            user: userInfo.name,
            cards: selectedCards,
            reading: slidesArray
        });
    } catch (error) {
        console.error('Groq Error:', error);
        res.status(500).json({ error: 'Tarot falı oluşturulurken bir hata oluştu.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
