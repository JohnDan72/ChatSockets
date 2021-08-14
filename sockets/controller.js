const { Socket } = require("socket.io");
const { comprobarJWTSocket } = require("../helpers");


const socketController = async(socket = new Socket()) => {
    // console.log(socket.handshake.headers['auth-token']);

    const tokenAux = socket.handshake.headers['auth-token'];

    const user = await comprobarJWTSocket(tokenAux);
    if (!user) {
        return socket.disconnect();
    }
    console.log(user);
}

module.exports = { socketController };