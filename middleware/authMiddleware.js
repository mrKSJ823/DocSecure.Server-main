const jwt = require('jsonwebtoken');

let secret_key = "26a8VsKC7m65GCT1GWPMQ8l5IBf0kMdQqMD2qMFfLX251wO96qjLfKAXvhDu7y8Q"

// Basic authentication middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['token'];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Role-based access control middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        
        next();
    };
};

module.exports = {
    authMiddleware,
    requireRole,
    secret_key
}
