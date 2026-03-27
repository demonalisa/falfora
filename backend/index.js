require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pickRandomCards } = require('./cards');
const { checkJwt } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        // Kartları otomatik seçiyoruz
        const selectedCards = pickRandomCards(cardCount);

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

      ÖNEMLİ FORMAT VE UZUNLUK KURALI:
      Yazacağın fal metni TAM OLARAK ${cardCount + 3} paragraf uzunluğunda olmalıdır.
      Kurgun şu sırayla ilerlemelidir:
      1. Paragraf: Mistik ve etkileyici bir giriş yazısı.
      Orta Paragraflar: Seçilen her bir kart için, kartın ismini veya numarasını ASLA zikretmeden, tamamen o kartın manasını anlatan 1 paragraf (Toplam ${cardCount} paragraf).
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/gi, '').replace(/```/g, '').trim();

        let slidesArray;
        try {
            slidesArray = JSON.parse(text);
        } catch (e) {
            console.error('JSON Parse Error, falling back to string:', e, text);
            // Fallback just in case
            slidesArray = [text];
        }

        res.json({
            user: userInfo.name,
            cards: selectedCards,
            reading: slidesArray
        });
    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ error: 'Tarot falı oluşturulurken bir hata oluştu.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
