const { v4: uuidv4} = require('uuid');
const path = require("path");

const subirArchivo = ( files , extensionesValidas = ['png','jpg','jpeg','tiff'] , carpeta = '') => {
    return new Promise ( ( resolve , reject ) => {
        const { archivo } = files;
        //sacar extensión
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        //validar la extension
        if(!extensionesValidas.includes(extension)){
            return reject(`Extensiones permitidas ${extensionesValidas}`);
        }
        console.log(nombreCortado);
        console.log(extension);
        
    
        const nombreTemp = uuidv4() + '.' + extension;
        //dirección del archivo para subirlo
        const pathfile = path.join(__dirname , '../uploads/',carpeta , nombreTemp);
    
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(pathfile, (err) => {
            if (err){
                console.log(err);
                return reject(err);
            }
            
            resolve(nombreTemp);
        });
    })
    
}


module.exports = {
    subirArchivo
}