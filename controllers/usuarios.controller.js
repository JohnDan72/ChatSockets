const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const usuariosGet = async(req = request, res = response) => {
  const { limit = 5, page = 0} = req.query;
  const desde = parseInt(page*limit);

  //esto ejecuta las promesas secuencialmente (tarda más tiempo)
  // const usuarios = await Usuario.find({estado: true}).skip(desde).limit(parseInt(limit));
  // const total = await Usuario.countDocuments({estado: true});

  const [ users, total] = await Promise.all([ //ejecuta y devuelve las promesas concurrentemente
    Usuario.find({estado: true}).skip(desde).limit(parseInt(limit)),
    Usuario.countDocuments({estado: true})
  ])

  res.status(201).json({
    msg: "get",
    total,
    users
  });
}

const usuarioGetById = (req = request,res = response) => {
  res.status(200).json({
    msg: 'Get usuario by id',
    id: req.params
  })
}


const usuariosPost = async(req = request, res = response) => {
  
  const { nombre, correo, password, role} = req.body;
  const miuser = new Usuario({ nombre, correo, password, role});

  //encriptar la contraseña
  const salt = bcrypt.genSaltSync(); //por defecto 10
  miuser.password = bcrypt.hashSync( password , salt);  
  miuser.save(); //se guarda el objeto

  res.status(201).json({
    msg: 'post',
    miuser
  });
}
// const usuariosPost = (req = request, res = response) => {
//   const { nombre, edad } = req.body;

//   res.status(201).json({
//     msg: 'post',
//     body: req.body,
//     edad: edad,
//     nombre: nombre,

//   });
// }

//actualizar los datos del registro
const usuariosPut = async(req = request, res = response) => {
  const {id_user} = req.params;
  const { _id, password, google, ...resto} = req.body;

  if(password){
    //encriptar la contraseña
    const salt = bcrypt.genSaltSync(); //por defecto 10
    resto.password = bcrypt.hashSync( password , salt);  
  }

  const usuario = await Usuario.findByIdAndUpdate(id_user, resto);
  
  res.status(201).json({
    msg: "put a usuario en Mongo",
    id_user
  });
}
const usuariosDelete = async(req = request, res = response) => {
  const { id_user } = req.params;
  const otro_uid = req.uid;
  const { usuario_solicita } = req;
  //borrar físicamente
  // const user = await Usuario.findByIdAndDelete(id);

  //borrar solo por estado
  const user = await Usuario.findByIdAndUpdate(id_user,{estado: false});

  res.status(201).json({
    msg: "delete",
    uid: otro_uid,
    user,
    usuario_solicita
  });
}


module.exports = {
  usuariosGet,
  usuarioGetById,
  usuariosPost,
  usuariosPut,
  usuariosDelete
}

//funcion para JWT
// function parseJWT(token){
//   let base64Url = token.split('.')[1];
//   let base64 = base64URL.replace('-','+').replace('_','/');
//   return JSON.parse(window.atob(base64));
// }