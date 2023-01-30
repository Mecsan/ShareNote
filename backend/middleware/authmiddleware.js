const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        if (!token) throw new Error("authetication required ");
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (e) {
        res.json({ success: false, msg: e.message, Remove_auth: true })
    }
}

module.exports = authenticate;