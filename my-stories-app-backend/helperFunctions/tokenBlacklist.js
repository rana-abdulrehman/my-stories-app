const blacklistedTokens = new Set();

module.exports = {
    addToBlacklist: (token) => {
        blacklistedTokens.add(token);
    },
    isBlacklisted: (token) => {
        return blacklistedTokens.has(token);
    },
    removeFromBlacklist: (token) => {
        blacklistedTokens.delete(token);
    }
}