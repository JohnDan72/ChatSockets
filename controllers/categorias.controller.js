const { request, response } = require("express");
const { Categoria, Usuario } = require('../models');
// get categorias
/**my task from Udemy:
 * paginado
 * total
 * populate de mongoose
 */
const getCategorias = async(req = request, res = response) => {
    try {
        const { limit = 5, page = 0 } = req.query

        const [categories, total] = await Promise.all([
            Categoria.find({ estado: true })
            .populate('usuario',['nombre','correo'])
            .skip(parseInt(limit * page))
            .limit(parseInt(limit)),
            Categoria.countDocuments({ estado: true })
        ])

        res.status(201).json({
            msg: "get categorias",
            categories,
            total
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error_msg: 'Error 500: ' + err
        })
    }

}

// get categoria by id
/**my task from Udemy:
 * populate de mongoose
 */
const getCategoriaById = async (req = request, res = response) => {
    const { id_cat } = req.params;
    const categoria = await Categoria.findOne({_id:id_cat}).populate('usuario',['nombre','correo']);

    res.status(201).json({
        msg: "get categoria by id",
        categoria
    })
}

// create a category with a valid token
const crearCategoria = async(req = request, res = response) => {
    try {
        let { nombre } = req.body;
        nombre = nombre.toUpperCase();

        const catDB = await Categoria.findOne({ nombre });
        if (catDB) {
            return res.status(400).json({
                error_msg: 'La categoría ya existe'
            });
        }


        // Generar la data a guardar
        const { _id } = req.usuario_solicitante
        const data = {
            nombre,
            usuario: _id
        }

        const newCat = new Categoria(data);
        await newCat.save();
        res.status(201).json({
            msg: "create categoria",
            data,
            newCat
        });
    } catch (err) {
        console.log('Error: ' + err);
        return res.status(500).json({
            error_msg: 'Error: ' + err
        });
    }

}

// actualizar categoria con un token válido
/**my task from Udemy:
 * recibe nombre
 * no se repite nombre
 */
const updateCategoria = async (req = request, res = response) => {
    const {id_cat} = req.params;
    let { nombre } = req.body;
    nombre = nombre.toUpperCase();
    const userId = req.usuario_solicitante._id;

    const catUpdated = await Categoria.findByIdAndUpdate(id_cat,{
        nombre,
        usuario:userId
    })
    res.status(201).json({
        msg: "update categoria",
        catUpdated
    })
}

// delete categoria by id
/**my task from Udemy:
 * cambiar estado a false
 * token de user admin
 */
const deleteCategoria = async (req = request, res = response) => {

    const { id_cat } = req.params;

    const catDeleted = await Categoria.findByIdAndUpdate(id_cat,{
        estado: false
    })
    res.status(201).json({
        msg: "delete categoria",
        catDeleted
    })
}

module.exports = {
    getCategorias,
    getCategoriaById,
    crearCategoria,
    updateCategoria,
    deleteCategoria
}