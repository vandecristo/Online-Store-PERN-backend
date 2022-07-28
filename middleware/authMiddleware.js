const jwt = require('jsonwebtoken');

const unAuthMessage = 'Unauthorized';

module.exports = function (req, res, next) {
    if (req.method  === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
           
            return  res.status(401).json({ message: unAuthMessage});
        }
        jwt.verify(token, process.env.SECRET_KEY,null,(err, veriefiedJwt) => {
            if (err) {
                res.send(err);
            } else {
                req.user = veriefiedJwt;
            }
            next();
        });

    } catch (e) {
        res.status(401).json({ message: unAuthMessage });
    }
};
