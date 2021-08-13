const { Router } = require("express");
const { check } = require("express-validator");
const {
    getCategorias,
    getCategoriaById,
    crearCategoria,
    updateCategoria,
    deleteCategoria
} = require("../controllers/categorias.controller");
const { existeCategoria, existeCategoriaByName } = require("../helpers/db-validators");

const { validaJWT, validarCampos, tieneRole } = require("../middlewares");


// url = 'http://localhost/api/categorias'
const router = Router();
// get categorias por paginación
router.get("/", [

], getCategorias);

// get categoria by id
router.get("/:id_cat", [
    check('id_cat','Id incorrecto').isMongoId(),
    check('id_cat').custom(existeCategoria),
    validarCampos
], getCategoriaById);

// crear cualquier categoria por cualquier token válido
router.post("/", [
    validaJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// actualizar categoria por cualquier token válido
router.put("/:id_cat", [
    validaJWT,
    check('id_cat','Id incorrecto').isMongoId(),
    check('id_cat').custom(existeCategoria),
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('nombre').custom(existeCategoriaByName),
    validarCampos
], updateCategoria);

// borrar una categoria por cualquier token válido que sea ADMIN
router.delete("/:id_cat", [
    validaJWT,
    // validaRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id_cat','Id incorrecto').isMongoId(),
    check('id_cat').custom(existeCategoria),
    validarCampos   
], deleteCategoria);

module.exports = { router };