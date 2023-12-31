const { expressjwt } = require('express-jwt')

function authJwt(){
    console.log('Executing authJwt middleware');
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL

    return expressjwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

module.exports = authJwt;