const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { auth } = require('express-oauth2-jwt-bearer');

// Auth0 için standart doğrulayıcı
const checkAuth0 = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256'
});

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        // 1. ADIM: Kendi yerel JWT'miz mi? (Şifre/E-posta ile girenler için)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next(); // Başarılıysa devam et
        } catch (localError) {
            // Eğer yerel JWT değilse, Auth0 token'ı olabilir, 2. adıma geç
            console.log('[AuthMiddleware] Local JWT check failed, trying Auth0...');
        }

        // 2. ADIM: Auth0 Token mı? (Google ile girenler için)
        // express-oauth2-jwt-bearer bir middleware olduğu için onu burada manuel çağırıyoruz
        checkAuth0(req, res, async (err) => {
            if (!err && req.auth) {
                // Auth0 başarılı! Token içindeki 'sub' (User ID) ile bizdeki kullanıcıyı eşleştiriyoruz
                const email = req.auth.payload.email || req.auth.payload['https://falfora.com/email']; // Auth0 custom claim check
                // sub bazlı bulmaya çalış veya email bazlı (google-sync logic)
                let user = await User.findOne({
                    $or: [
                        { email: req.auth.payload.email },
                        { sub: req.auth.payload.sub }
                    ]
                });

                if (user) {
                    req.user = user;
                    return next();
                }
            }

            // İkisi de başarısızsa
            res.status(401);
            throw new Error('Not authorized, token failed');
        });
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };
