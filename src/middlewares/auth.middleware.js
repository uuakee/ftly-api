const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "cc71eda2e7b4de8f69db9cf3db40223b5da8283d6181bd08832141a2980ee7aa";

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: "Acesso negado" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: "Token inválido" });
    }
};

module.exports = authMiddleware;
