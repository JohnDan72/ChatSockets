const { Role, Usuario, Categoria, Producto } = require("../models");

//checar role válido
const checarRoleValido = async(rol = '') => {
    const existeRole = await Role.findOne({ role: rol });
    if(!existeRole){
        throw new Error(`El rol ${ rol } no esta registrado en la DB`)
    }
}

//verificar si el correo existe
const checarEmailExiste= async(email = '') => {
    const existeMail = await Usuario.findOne({correo: email});
    if(existeMail){
        throw new Error(`Este correo ${email} ya esta registrado`);
    }
}

//verificar si el correo existe para LOGIN
const checarEmailExisteLogin= async(email = '') => {
    const existeMail = await Usuario.findOne({correo: email, estado: true});
    if(!existeMail){
        throw new Error(`La cuenta con este correo no existe`);
    }
}

//existe usuario by id
const existeUsuarioById = async(id = '') => {
    const existeUsuario = await Usuario.findOne({_id:id});
    if(!existeUsuario){
        throw new Error(`Este usuario con id ${id} no existe`);
    }
}

//checar num entero para paginación de GET usuarios
const enteroValido = (num = 0) => {
    const val = parseInt(num);
    if(isNaN(val) || val % 1 != 0){
        throw new Error(`El parámetro debe ser un número entero`);
    }
}


// checar si el registro existe y estado true
const existeCategoria = async (id_cat) => {
    const categoria = await Categoria.findOne({_id:id_cat, estado:true});
    if(!categoria)
        throw new Error('La categoría no existe');
}

// checar si existe categoria por nombre
const existeCategoriaByName = async(nombre) => {
    const aux = nombre.toUpperCase();
    const categoria = await Categoria.findOne({nombre:aux});

    if(categoria){
        throw new Error('La categoria ya existe');
    }
}


/**Validaciones de Producto */
const existeNombreProd = async ( nombre ) => {
    nombre = nombre.toUpperCase();
    const producto = await Producto.findOne({nombre});
    if(producto){
        throw new Error('Este producto ya existe');
    }
}   

const validaCategoria = async(id_cat) => {
    const categoria = await Categoria.findOne({_id:id_cat,estado:true});
    if(!categoria){
        throw new Error('La categoría no existe');
    }
}

const existeProducto = async (id_cat) => {
    const producto = await Producto.findOne({_id:id_cat});
    if(!producto){
        throw new Error('El producto no existe');
    } 
}


// Validar colecciones permitidas
const checarColecciones = ( coleccion , colecPermitidas ) => {
    if(!colecPermitidas.includes(coleccion)){
        throw new Error(`Coleccion no permitida. Permitidas: ${colecPermitidas}`);
    }
    return true;
}

module.exports = {  checarRoleValido,
                     checarEmailExiste,
                     checarEmailExisteLogin,
                     existeUsuarioById,
                     enteroValido,
                     existeCategoria,
                     existeCategoriaByName,
                     validaCategoria,
                     existeNombreProd,
                     existeProducto,
                     checarColecciones }