const asyncHandler = require('express-async-handler');
const Reading = require('../models/Reading');
const Stats = require('../models/Stats');
const Groq = require('groq-sdk');
const { pickRandomCards } = require('../utils/cards');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc Create a new reading
// @route POST /api/readings
// @access Private
const createReading = asyncHandler(async (req, res) => {
    const { cardCount = 3, spreadName = "Genel", userInfo, manualCards, type = "tarot" } = req.body;

    if (!userInfo) {
        res.status(400);
        throw new Error('User info is required');
    }

    const selectedCards = manualCards && Array.isArray(manualCards) ? manualCards : pickRandomCards(cardCount);
    const readingType = `${cardCount} kartlık (${spreadName}) Tarot okuması`;

    const isLoveSpread = type === "love_7" || spreadName === "Aşk Açılımı";
    const isDailySpread = type === "3_cards" || spreadName === "Günlük Bakış";
    const isGalacticSpread = type === "10_cards" || spreadName === "Galaktik Açılım";
    const isSingleSpread = type === "single_1" || spreadName === "Günün Tavsiyesi";

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

    // Update Stats (Global) - Optional performance enhancement
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Stats.findOneAndUpdate(
        { date: today, type: 'tarot' },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
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

module.exports = {
    createReading,
    getReadings,
    getReadingById,
    deleteReading
};
