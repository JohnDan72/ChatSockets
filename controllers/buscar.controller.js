const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario , Categoria , Producto , Role } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

// busqueda de usuarios
const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if( esMongoId ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({ 
        $or: [
                { nombre: regex } , 
                { correo: regex } ,
                { role: regex } 
            ],
        $and: [
            {estado: true}
        ]
     });
    res.json({
        results: usuarios
    })
}

//busqueda de categorias
const buscarCategorias = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if( esMongoId ){
        const categoria = await Categoria.findById(termino).populate('usuario','nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex , estado: true}).populate('usuario','nombre');
    res.json({
        results: categorias
    })
}
// busqueda de productos
const buscarProductos = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if( esMongoId ){
        const producto = await Producto.findById(termino)
                                        .populate('usuario', 'nombre')
                                        .populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ 
        $or: [
                { nombre: regex } , 
                { descripcion: regex } 
            ],
        $and: [
            {estado: true}
        ]
     })
     .populate('usuario', 'nombre')
     .populate('categoria','nombre');

    res.json({
        results: productos
    })
}

// búsqueda principal
const buscar = ( req = request , res = response) => {
    const { coleccion, termino } = req.params;
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            error_msg: `Colecciones permitidas: ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case coleccionesPermitidas[0]:
            buscarUsuarios(termino , res);
        break;
        case coleccionesPermitidas[1]:
            buscarCategorias(termino , res);
        break;
        case coleccionesPermitidas[2]:
            buscarProductos(termino , res);
        break;
        case coleccionesPermitidas[3]:
        
        break;

        default:
            return res.status(500).json({
                error_msg: 'Error en busqueda'
            })
    }

    // res.status(201).json({
    //     msg: 'Buscador general ...',
    //     params: req.params
    // })
}

module.exports = {
    buscar
}