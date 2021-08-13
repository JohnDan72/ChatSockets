const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validaJWT = async(req = request, res = response, next) => {
    const token = req.header('Authorization');
    console.log(`${token}`);

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(payload);
        //desde aqui en lo que continue se seguirá usando la info de la req con el nuevo parámetro
        req.uid = payload.uid;
        const userReq = await Usuario.findOne({ _id: req.uid });

        if (!userReq) {
            return res.status(401).json({
                msg: 'Usuario no existe'
            })
        }
        if (!userReq.estado) {
            return res.status(401).json({
                msg: 'Usuario con estado false'
            })
        }
        req.usuario_solicitante = userReq;
        next();
    } catch (error) {
        console.log(`Error en valida token`);
        return res.status(401).json({
            msg: 'Error en valida token'
        })
    }


}

module.exports = { validaJWT }