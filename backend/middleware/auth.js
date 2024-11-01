const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || req.headers["Authorization"];
        if (!token) throw new Error("authetication required ");
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401);
        next(e);
    }
}

module.exports = authenticate;
