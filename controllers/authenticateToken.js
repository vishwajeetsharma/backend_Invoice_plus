const jwt = require('jsonwebtoken')
require('dotenv').config()

async function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        // if (err){ res.sendStatus(403) }
        req.err = err
        req.user = user
    })
    next()
}

module.exports = authenticateToken;