const { Socket } = require("socket.io");
const { comprobarJWTSocket } = require("../helpers");
const { ChatInfo } = require("../models");

const chats = new ChatInfo();

const socketController = async(socket = new Socket(), io) => {
    // console.log(socket.handshake.headers['auth-token']);

    const tokenAux = socket.handshake.headers['auth-token'];

    const user = await comprobarJWTSocket(tokenAux);
    if (!user) {
        return socket.disconnect();
    }
    console.log('Se conecó: ',user.nombre);

    // Agregar usuario conectado
    chats.agregarUsuario(user);

    io.emit('usuarios-activos', chats.usuariosArr)

    socket.on('disconnect', ( id , callback) => {
        chats.desconectaUsuario(id);
        io.emit('usuarios-activos', chats.usuariosArr);
    })
    
}

module.exports = { socketController };