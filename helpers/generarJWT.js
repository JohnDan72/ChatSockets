const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid }
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(`${err}`);
                reject('No se cumplio generar el token');
            } else {
                resolve(token);
            }
        });
    })
}

const comprobarJWTSocket = async(token) => {
    try {
        if (!token || token.length <= 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const userAux = await Usuario.findById(uid);
        if (!userAux || !userAux.estado) {
            return null;
        }
        return userAux;

    } catch (error) {
        return null
    }
}

module.exports = { generarJWT, comprobarJWTSocket }