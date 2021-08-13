const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");
const { validaGoogle } = require("../helpers/google-verify");

const loginUser = async(req= request, resp = response) => {
    try{
        const {correo, password} = req.body;
        const userAux = await Usuario.findOne({correo});
        // verificar si el email existe
        // si el usuario esta activo
        //CHECK desde el auth.routes

        // verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, userAux.password);
        if(!validPassword){
            return resp.status(400).json({
                error_msg: 'Usuario/password incorrectos - password'
            })
        }
        
        // General el JWT
        const token = await generarJWT(userAux._id);

        resp.status(200).json({
            token,
            userAux,
            correo,
            password
        })
    }
    catch(error){ //internal server error
        console.log(`${error}`);
        
        return resp.status(500).json({
            error_msg: 'Algo salió mal, contacte al administrador',
        })
    }
    
}

const googleLogin = async(req = request, res = response) => {
    let {id_token} = req.body

    try{
        // let googleUser = await validaGoogle(id_token);
        const { correo, nombre, img} = await validaGoogle(id_token);

        let usuario = await Usuario.findOne({ correo });

        if(!usuario){ //tengo que crear usuario
            const data = {
                nombre,
                correo,
                password: ':P', //no es necesario una password
                img,
                google: true
            };
            usuario = new Usuario( data );
            await usuario.save();
        }

        // console.log(googleUser);
        // si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                error_msg: 'El usuario esta bloquedao'
            })
        }
        
        res.status(200).json({
            msg: 'Token llegado', 
            usuario,
            token: id_token
        })
    }catch(error){
        res.status(500).json({
            msg: 'Error inesperado',
            error
        })
    }
    
}

module.exports = { loginUser, googleLogin }