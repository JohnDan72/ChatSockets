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
    console.log('id: ',user._id);

    // Agregar usuario conectado
    chats.agregarUsuario(user);

    io.emit('usuarios-activos', chats.usuariosArr)

    // sala privada de cada usuario
    socket.join( user._id ) //3 salas global: io , volatil: socket.id , privada: user._id
    socket.on('disconnect', () => {
        console.log('Se desconecó: ',user.nombre);
        chats.desconectaUsuario(user._id);
        io.emit('usuarios-activos', chats.usuariosArr);
    });

    socket.on('enviar-mensaje', (payload) => {
        const { uid , mensaje } = payload;

        if( uid ){ //mensaje privado
            console.log(uid);
            
            socket.to( uid ).emit('recibir-mensaje-priv',{de: user.nombre , mensaje});
        }
        else{ //para todo el mundo
            chats.enviarMensaje( uid , user.nombre , mensaje);
            io.emit('recibir-mensaje', chats.ultimos10)
        }
        
        // console.log(payload);
        // callback();
        
    })
    
}

module.exports = { socketController };