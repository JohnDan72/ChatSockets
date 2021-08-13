const { Router } = require("express");
const { check } = require("express-validator");
const { getProductos,
        getProductoById,
        createProduct,
        updateProduct,
        deleteProduct } = require("../controllers/productos.controller");
const { validaCategoria, existeNombreProd, existeProducto } = require("../helpers/db-validators");
const { validarCampos, validaJWT, tieneRole } = require("../middlewares");

const   router = Router();
//get all productos
router.get('/',getProductos);

//get product by id
router.get('/:id_prod',[
    check('id_prod','Id incorrecto').isMongoId(),
    check('id_prod').custom(existeProducto),
    validarCampos
],getProductoById);

//create new product
router.post('/',[
    validaJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('nombre').custom(existeNombreProd),
    check('id_cat','Id cat incorrecto').isMongoId(),
    check('id_cat').custom(validaCategoria),
    check('descripcion','Tamaño máximo: 300').isLength({max:300}),
    validarCampos
],createProduct);

//update product
router.put('/:id_prod',[
    validaJWT,
    check('id_prod','Id prod incorrecto').isMongoId(),
    check('id_prod').custom(existeProducto),

    check('nombre','El nombre es requerido').not().isEmpty(),
    check('nombre').custom(existeNombreProd),
    check('id_cat','Id cat incorrecto').isMongoId(),
    check('id_cat').custom(validaCategoria),
    check('descripcion','Tamaño máximo: 300').isLength({max:300}),
    validarCampos
],updateProduct);

//delete product
router.delete('/:id_prod',[
    validaJWT,
    // validaRole,
    tieneRole('ADMIN_ROLE'),
    check('id_prod','Id prod incorrecto').isMongoId(),
    check('id_prod').custom(existeProducto),

    validarCampos
],deleteProduct);

module.exports = {router};
