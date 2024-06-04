const jwt = require('jsonwebtoken');

const verifyToken = (req) => {
    try {
        let token = req.headers.authorization;
        if (!token) throw new Error('Authorization token not provided');

        token = token.replace('Bearer ', ''); 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded.userId;
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

module.exports = verifyToken;
