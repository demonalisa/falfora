const asyncHandler = require('express-async-handler');
const Reading = require('../models/Reading');
const Stats = require('../models/Stats');
const Groq = require('groq-sdk');
const { pickRandomCards } = require('../utils/cards');
const { getRelationshipLabel, getGenderLabel, getZodiacLabel } = require('../utils/userConstants');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc Create a new reading
// @route POST /api/readings
// @access Private
const createReading = asyncHandler(async (req, res) => {
    const { cardCount = 3, spreadName = "Genel", userInfo, manualCards, selectedCards: reqSelectedCards, type = "tarot" } = req.body;

    if (!userInfo) {
        res.status(400);
        throw new Error('User info is required');
    }

    const selectedCards = reqSelectedCards || (manualCards && Array.isArray(manualCards) ? manualCards : pickRandomCards(cardCount));

    const themes = {
        'loveReading7': {
            title: 'Aşk Açılımı',
            details: [
                '1. KART: Senin (Kullanıcının) derin duyguları ve mevcut ruh halin.',
                '2. KART: Karşı tarafın (Partnerin/Adayın) sana karşı gerçek hisleri.',
                '3. KART: İlişkideki mevcut enerji ve aranızdaki kozmik uyum.',
                '4. KART: Senin bu ilişkiden beklentin, umudun veya gizli isteğin.',
                '5. KART: Karşı tarafın bu ilişkiden beklentisi ve vizyonu.',
                '6. KART: Yolunuza çıkan bir engel, çözülmesi gereken bir düğüm veya dış bir zorluk.',
                '7. KART: İlişkinin yakın gelecekteki potansiyeli ve varacağı kozmik sonuç.'
            ]
        },
        'dailyReading3': {
            title: 'Günlük Bakış',
            details: [
                '1. KART: Geçmişin tortuları ve bugününü etkileyen eski enerjiler.',
                '2. KART: Bugünün ana enerjisi, şu anki mevcut durumun.',
                '3. KART: Yakın gelecekte seni bekleyen potansiyel ve kozmik mesaj.'
            ]
        },
        'celticCrossReading10': {
            title: 'Galaktik Açılım',
            details: [
                '1. KART: Mevcut Durumun ve merkezin.',
                '2. KART: Yoluna çıkan zorluk ve engel.',
                '3. KART: Amaçların, dileklerin ve en iyi ihtimal.',
                '4. KART: Bilinçaltın, temel korkuların ve köklerin.',
                '5. KART: Geçmişin enerjisi, arkanda bıraktıkların.',
                '6. KART: Yakın gelecekte karşılaşacağın etkiler.',
                '7. KART: Kendi iç dünyan ve bakış açın.',
                '8. KART: Dış dünyadaki insanların seni nasıl gördüğü ve çevre etkileri.',
                '9. KART: Umutların, beklentilerin veya endişelerin.',
                '10. KART: Kozmik sonuç, varacağın son nokta.'
            ]
        },
        'oneCardReading1': {
            title: 'Günün Tavsiyesi',
            details: [
                '1. KART: Bugün alman gereken ana mesaj, genel tavsiye ve günün rehberlik enerjisi.'
            ]
        }
    };

    const currentSpread = themes[type] || {
        title: spreadName || 'Genel Açılım',
        details: selectedCards.map((_, i) => `${i + 1}. KART: Bu kartın genel enerjisi ve yorumu.`)
    };

    const prompt = `
      Sen kadim bilgilere sahip, sezgileri çok güçlü bir Tarot Ustasısın. 
      Aşağıda kullanıcı bilgileri:
      - İsim: ${userInfo.name || 'Kullanıcı'}
      - Doğum Tarihi: ${userInfo.birthDate || 'Belirtilmedi'}
      - Burç: ${getZodiacLabel(userInfo.horoscope) || 'Belirtilmedi'}
      - Cinsiyet: ${getGenderLabel(userInfo.gender) || 'Belirtilmedi'}
      - İlişkisel Durum: ${getRelationshipLabel(userInfo.relationship) || 'Belirtilmedi'}

      Seçilen Kartlar:
      ${selectedCards.join('\n- ')}

      Bu bir "${currentSpread.title}"dır.
      Kartların yorum sırası ve temaları şu şekildedir:
      ${currentSpread.details.join('\n      ')}

      KURALLAR:
      1) Cevabın SADECE burada istenen kart yorumlarını içeren paragraflar olucak şekilde cevap versin. Toplam ${selectedCards.length} paragraf olmalıdır.
      2) 1. paragraf HER ZAMAN kullanıcıyı ismiyle ("${userInfo.name || 'Kullanıcı'}") mistik ve sıcak bir şekilde selamlayarak başlamalı, ardından ilk kartın yorumuyla devam etmelidir.
      3) Paragraflarda kart isimlerini (Kupa Ası vb.) veya numaralarını (1. Kart vb.) ASLA zikretme, doğrudan yorumu yap.
      4) Yanıtın SADECE aşağıdaki JSON formatında olmalıdır. Başka hiçbir metin ekleme.

      {
        "paragraphs": [
          "Selam [İsim]... İlk kartın yorumu...",
          "İkinci kartın yorumu...",
          ...
        ]
      }
    `;

    let chatCompletion;
    try {
        chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Sen kadim bilgilere sahip, sezgileri çok güçlü bir Tarot Ustasısın. Yanıtlarını HER ZAMAN ve SADECE TÜRKÇE dilinde, geçerli bir JSON objesi olarak verirsin.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.8,
            max_tokens: 2000,
            response_format: { type: 'json_object' }
        });
    } catch (groqError) {
        console.error('[Groq API Error]:', groqError);
        res.status(500);
        throw new Error('AI servisine bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
    }

    const text = chatCompletion.choices[0]?.message?.content || '{}';
    console.log('[Groq Response]:', text);

    let slidesArray;
    try {
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
            slidesArray = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
            // Eğer backend bir nesne döndürdüyse (giris, yorum, kapanis gibi) değerleri çek
            // Varsa 'paragraphs' veya 'slides' dizisini öncelikli al
            slidesArray = parsed.paragraphs || parsed.slides || parsed.reading || Object.values(parsed);
        } else {
            slidesArray = [text];
        }

        // Eğer hala dizi değilse diziye zorla
        if (!Array.isArray(slidesArray)) {
            slidesArray = [String(slidesArray)];
        }
    } catch (e) {
        // En kötü durumda metni düz temizle ve diziye at
        slidesArray = [text.replace(/["{}]/g, '').trim()];
    }

    // Save to Database
    const reading = await Reading.create({
        userId: req.user._id,
        type: type, // Artık özel tipi kaydediyoruz!
        result: slidesArray,
        cards: selectedCards,
        createdAt: new Date()
    });

    // Update Stats (Global) - Now categorized by specific reading type and grouped by month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    await Stats.findOneAndUpdate(
        { date: firstDayOfMonth, type: type || 'tarot_general' },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: 'after' }
    );

    res.status(201).json({
        _id: reading._id,
        user: userInfo.name,
        cards: selectedCards,
        reading: slidesArray,
        createdAt: reading.createdAt
    });
});

// @desc Get user readings
// @route GET /api/readings
// @access Private
const getReadings = asyncHandler(async (req, res) => {
    const readings = await Reading.find({
        userId: req.user._id,
        deletedByUser: false
    }).sort({ createdAt: -1 });

    res.json(readings);
});

// @desc Get reading by ID
// @route GET /api/readings/:id
// @access Private
const getReadingById = asyncHandler(async (req, res) => {
    const reading = await Reading.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (reading) {
        res.json(reading);
    } else {
        res.status(404);
        throw new Error('Reading not found');
    }
});

// @desc Soft delete reading
// @route DELETE /api/readings/:id
// @access Private
const deleteReading = asyncHandler(async (req, res) => {
    const reading = await Reading.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (reading) {
        reading.deletedByUser = true;
        await reading.save();
        res.json({ message: 'Reading removed' });
    } else {
        res.status(404);
        throw new Error('Reading not found');
    }
});

// @desc Clear all user readings (soft delete)
// @route DELETE /api/readings
// @access Private
const clearReadings = asyncHandler(async (req, res) => {
    await Reading.updateMany(
        { userId: req.user._id, deletedByUser: false },
        { $set: { deletedByUser: true } }
    );
    res.json({ message: 'All readings removed' });
});

module.exports = {
    createReading,
    getReadings,
    getReadingById,
    deleteReading,
    clearReadings
};
