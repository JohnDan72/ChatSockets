const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: [true, 'Foreign key error']
    },
});

CategoriaSchema.methods.toJSON = function(){
    const { __v, _id, estado, ...categoria} = this.toObject();
    categoria.uid = _id;
    return categoria;
}

module.exports = model('Categoria', CategoriaSchema);