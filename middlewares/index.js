const Validar_JWT = require('./validar-jwt');
const Validar_ROLE = require('./validar-role');
const Validar_Campos = require('./validarCampos');
const Validar_Files = require('./validarFile');

module.exports = {
    ...Validar_JWT,
    ...Validar_ROLE,
    ...Validar_Campos,
    ...Validar_Files
}