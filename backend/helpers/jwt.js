const { expressjwt } = require('express-jwt')

function authJwt(){
    console.log('Executing authJwt middleware');
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL

    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/upload(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

async function isRevoked(req, token) {
    
    try {
        if (!token.payload.isAdmin) {
            return true;
        }

        return false;
    } catch (error) {
        console.log(error)
        return error;
    }
}

module.exports = authJwt;