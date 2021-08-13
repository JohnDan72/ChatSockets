const { request, response } = require("express");
const { Categoria, Producto } = require("../models");

// get all products
const getProductos = async( req = request, res = response) => {
    const { limit = 5, page = 0} = req.query;

    const [ productos , total ] = await Promise.all([
        Producto.find({estado:true})
        .populate('usuario',['nombre'])
        .populate('categoria', ['nombre'])
        .skip(Number(limit*page))
        .limit(Number(limit))
        ,
        Producto.countDocuments({estado:true})
    ])

    res.status(201).json({
        msg: 'Get | Products',
        total,
        productos
    })
}

// get product by id
const getProductoById = async( req = request, res = response) => {
    const { id_prod } = req.params;
    const producto = await Producto.findOne({_id:id_prod})
                                    .populate('usuario', ['nombre','correo'])
                                    .populate('categoria', ['nombre']);

    res.status(201).json({
        msg: 'Get | Products by Id',
        producto
    })
}

// create product
const createProduct = async( req = request, res = response) => {
    const { nombre , precio , id_cat, descripcion} = req.body;
    const auxProd = await Producto.findOne({nombre});
    if(auxProd){
        return res.status(400).json({
            error_msg: 'Este producto ya existe'
        });
    }
    const id_user = req.usuario_solicitante._id;
    const data = {
        nombre: nombre.toUpperCase(),
        usuario: id_user,
        categoria: id_cat,
        precio,
        descripcion
    }

    const newProduct = new Producto(data);
    await newProduct.save();

    res.status(201).json({
        msg: 'POST | Create Product',
        newProduct
    })
}

// update product
const updateProduct = async( req = request, res = response) => {
    const { id_prod } = req.params;
    const { nombre , precio , id_cat, descripcion} = req.body;

    const id_user = req.usuario_solicitante._id;
    const data = {
        nombre: nombre.toUpperCase(),
        usuario: id_user,
        categoria: id_cat,
        precio,
        descripcion
    }

    const updatedProduct = await Producto.findByIdAndUpdate(id_prod,data);

    res.status(201).json({
        msg: 'PUT | Update product',
        updatedProduct
    })
}

// delete product
const deleteProduct = async( req = request, res = response) => {
    const { id_prod } = req.params;

    const deletedProduct = await Producto.findByIdAndUpdate(id_prod,{
        estado: false
    });


    res.status(201).json({
        msg: 'Delete | Delete product',
        deletedProduct
    })
}

module.exports = {
    getProductos,
    getProductoById,
    createProduct,
    updateProduct,
    deleteProduct
}