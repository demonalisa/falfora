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
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            user: userInfo.name,
            cards: selectedCards,
            reading: text
        });
    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ error: 'Tarot falı oluşturulurken bir hata oluştu.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
