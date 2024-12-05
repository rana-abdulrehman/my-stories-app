const blacklistedTokens = new Set();
const tokenExpiry = new Map();

module.exports = {
    addToBlacklist: (token) => {
        blacklistedTokens.add(token);
    },
    isBlacklisted: (token) => {
        return blacklistedTokens.has(token);
    },
    removeFromBlacklist: (token) => {
        blacklistedTokens.delete(token);
    },
    addToExpiry: (token, expiryTime) => {
        tokenExpiry.set(token, expiryTime);
    },
    isExpired: (token) => {
        const expiryTime = tokenExpiry.get(token);
        return expiryTime ? Date.now() > expiryTime : false;
    }
}