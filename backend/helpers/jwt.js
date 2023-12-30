const { expressjwt } = require('express-jwt')

function authJwt(){
    console.log('Executing authJwt middleware');
    const secret = process.env.JWT_SECRET;

    return expressjwt({
        secret,
        algorithms: ['HS256']
    })
}

module.exports = authJwt;