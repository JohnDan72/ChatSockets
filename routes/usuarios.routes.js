const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuarioGetById } = require('../controllers/usuarios.controller');
const { check, body, validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { checarRoleValido, checarEmailExiste, existeUsuarioById, enteroValido } = require('../helpers/db-validators');
const { validaJWT } = require('../middlewares/validar-jwt');
const { validaRole, tieneRole } = require('../middlewares/validar-role');

const   router = Router();
        router.get("/", usuariosGet);
        router.get("/getUsuario/:id", [
            check('id_user', 'Id no válido').isMongoId(),
            check('id_user').custom(existeUsuarioById),
        ],usuarioGetById);
        router.post("/", [
            check('correo', 'El correo no es valido').isEmail(),
            check('correo').custom(checarEmailExiste),
            check('nombre', 'Nombre obligatorio').not().isEmpty(),
            check('password', 'Debe de ser entre 8 y 20 caracteres').isLength({ min: 8, max: 20 }),
            check('role').custom(checarRoleValido), //o como abajo
            // check('role').custom( role => checarRoleValido(role)),
            // check('role','Role no válido').isIn(['ADMIN_ROLE','USER_ROLE']),
            validarCampos
        ], usuariosPost); //segundo middleware tercero controlador
        router.put("/:id_user", [
            check('id_user', 'Id no válido').isMongoId(),
            check('id_user').custom(existeUsuarioById),
            check('role').custom(checarRoleValido),
            validarCampos
        ], usuariosPut);
        router.delete("/:id_user", [
            validaJWT,
            // validaRole,
            tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
            check('id_user', 'Id no válido').isMongoId(),
            check('id_user').custom(existeUsuarioById),
            validarCampos
        ], usuariosDelete);

module.exports = {
    router
}