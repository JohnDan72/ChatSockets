const { request, response } = require("express");
const path = require("path");
const fs = require("fs");
const { subirArchivo } = require("../helpers");
const { Usuario , Producto } = require('../models');

// Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const uploadFile = async ( req = request , res = response) => {
    try {
        const pathCompleto = await subirArchivo( req.files , ['txt','doc','docx','csv'] , 'docs');
        res.json({ pathCompleto });
    } catch (error) {
        res.status(400).json(error);
    }
}

const updateImgUser = async ( req = request , res = response) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch(coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({error_msg: `No existe el usuario con id: ${id}`});
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({error_msg: `No existe el producto con id: ${id}`});
            }
        break;
        default:
            return res.status(500).json({error_msg: `Falta validar este caso: ${coleccion}`});
    }
    try {
        // limpiar imgs previas
        if(modelo.img){
            // borrar img del servidor
            const pathImagen = path.join(__dirname,'../uploads/',coleccion, modelo.img);
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }
        }
        modelo.img = await subirArchivo( req.files , undefined , coleccion);
        modelo.save();
        res.json({ modelo });
    } catch (error) {
        res.status(400).json(error);
    }
}
// mostrar una imagen
const mostrarImagen = async ( req = request , res = response) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch(coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({error_msg: `No existe el usuario con id: ${id}`});
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({error_msg: `No existe el producto con id: ${id}`});
            }
        break;
        default:
            return res.status(500).json({error_msg: `Falta validar este caso: ${coleccion}`});
    }
    try {
        // limpiar imgs previas
        if(modelo.img){
            // borrar img del servidor
            const pathImagen = path.join(__dirname,'../uploads/',coleccion, modelo.img);
            if(fs.existsSync(pathImagen)){
                return res.sendFile(pathImagen);
            }
        }
        // si no existe la imagen se manda un no image default
        const pathNoImage = path.join(__dirname,'../assets/no-image.jpg');
        res.sendFile(pathNoImage);
        
    } catch (error) {
        res.status(400).json(error);
    }
}


/**-------------------------Mismas funciones pero con Cloudinary -------------------------*/
const updateImgUserCloudinary = async ( req = request , res = response) => {

    const { coleccion , id } = req.params;

    let modelo;

    switch(coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({error_msg: `No existe el usuario con id: ${id}`});
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({error_msg: `No existe el producto con id: ${id}`});
            }
        break;
        default:
            return res.status(500).json({error_msg: `Falta validar este caso: ${coleccion}`});
    }
    try {
        // limpiar imgs previas
        if(modelo.img){
            // borrar img del servidor de Cloudinary
            const nombreArr = modelo.img.split("/");
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');

            cloudinary.uploader.destroy( public_id );
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;
        await modelo.save();

        res.json({ modelo });
    } catch (error) {
        res.status(400).json(error);
    }
}
module.exports = {
    uploadFile,
    updateImgUser,
    mostrarImagen,
    updateImgUserCloudinary
}