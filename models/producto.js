const { Schema, model } = require("mongoose");


const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    },
    precio: {
        type: Number,
        default: 0.0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }

})

ProductoSchema.methods.toJSON = function(){
    const {__v, estado, ...product} = this.toObject();
    return product;
}

module.exports = model('Producto',ProductoSchema);