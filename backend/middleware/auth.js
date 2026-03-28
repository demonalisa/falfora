const { auth } = require('express-oauth2-jwt-bearer');

// Primary Auth0 JWT Validation
const auth0Check = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256'
});

// ROBUST BYPASS for Local Development
const checkJwt = (req, res, next) => {
    // If we are NOT in production, just allow everything
    if (process.env.NODE_ENV !== 'production') {
        // console.log('[Auth] Development mode: Bypassing auth check');
        return next();
    }
    
    // In Production: enforce standard Auth0 validation
    return auth0Check(req, res, next);
};

module.exports = { checkJwt };
