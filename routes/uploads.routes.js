const { Router } = require("express");
const { check } = require("express-validator");
const { uploadFile, updateImgUser, mostrarImagen, updateImgUserCloudinary } = require("../controllers/uploads.controller");
const { checarColecciones } = require("../helpers");
const { validarCampos, validaArchivo } = require("../middlewares");


const router = Router();
        router.post("/",[],uploadFile);
        router.put("/:coleccion/:id",[
                validaArchivo,
                check('id','id mongo incorrecto').isMongoId(),
                check('coleccion').custom( co => checarColecciones( co , ['usuarios','productos'])),
                validarCampos
        ],updateImgUserCloudinary);
        router.get("/:coleccion/:id",[
                check('id','id mongo incorrecto').isMongoId(),
                check('coleccion').custom( co => checarColecciones( co , ['usuarios','productos'])),
                validarCampos   
        ],mostrarImagen);

module.exports = {router}