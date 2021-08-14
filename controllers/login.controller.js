const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");
const { validaGoogle } = require("../helpers/google-verify");

const loginUser = async(req = request, resp = response) => {
    try {
        const { correo, password } = req.body;
        const userAux = await Usuario.findOne({ correo });
        // verificar si el email existe
        // si el usuario esta activo
        //CHECK desde el auth.routes

        // verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, userAux.password);
        if (!validPassword) {
            return resp.status(400).json({
                success: false,
                error_msg: 'Usuario/password incorrectos - password'
            })
        }

        // General el JWT
        const token = await generarJWT(userAux._id);

        resp.status(200).json({
            success: true,
            token
        })
    } catch (error) { //internal server error
        console.log(`${error}`);

        return resp.status(500).json({
            success: false,
            error_msg: 'Algo salió mal, contacte al administrador',
        })
    }

}

const googleLogin = async(req = request, res = response) => {
    let { id_token } = req.body

    try {
        // let googleUser = await validaGoogle(id_token);
        const { correo, nombre, img } = await validaGoogle(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) { //tengo que crear usuario
            const data = {
                nombre,
                correo,
                password: ':P', //no es necesario una password
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        // console.log(googleUser);
        // si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                success: false,
                error_msg: 'El usuario esta bloquedao'
            })
        }
        // General el JWT
        const token = await generarJWT(usuario._id);
        res.status(200).json({
            msg: 'Token llegado',
            usuario,
            token,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error inesperado',
            error
        })
    }

}

const renovarToken = async(req = request, res = response) => {
    const { _id, nombre } = req.usuario_solicitante;

    try {
        // General el JWT
        const token = await generarJWT(_id);

        res.json({
            success: true,
            nuevo_token: token,
            _id,
            nombre
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error_msg: 'Error inseperado en el servidor'
        })
    }


}

module.exports = { loginUser, googleLogin, renovarToken }