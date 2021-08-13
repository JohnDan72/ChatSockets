
const dbValidators = require("./db-validators");
const my_jwt = require("./generarJWT");
const googleVerify = require("./google-verify");
const uploadFiles = require("./uploadsFiles");


module.exports = {
    ...dbValidators,
    ...my_jwt,
    ...googleVerify,
    ...uploadFiles
}
