
// fields
const txt_uid       = document.querySelector('#txt_uid');
const txt_mensaje   = document.querySelector('#txt_mensaje');
const ulSsuarios    = document.querySelector('#ulSsuarios');
const ulMensajes    = document.querySelector('#ulMensajes');
const btn_logout    = document.querySelector('#btn_logout');

let usuario = null;
let socketServer = null;
const url = 'http://localhost:8080/api/auth/';



const validarJWT = async() => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location = 'index.html';
        throw new Error('Token invalido');
    }

    const resp = await fetch(url, {
        headers: { 'Authorization': token }
    })

    const { success, _id, nuevo_token, nombre } = await resp.json();
    if (!success) { window.location = 'index.html'; }
    document.title = nombre;

    await conectarSocket();
}

const conectarSocket = async() => {
    const socketServer = io({
        'extraHeaders': {
            'auth-token': localStorage.getItem('token')
        }
    });

    socketServer.on('connect', () => {
        console.log("User online");
    });
    socketServer.on('disconnect', () => {
        console.log("User offline");
    })

    socketServer.on('recibir-mensaje', () => {
        
    });

    socketServer.on('usuarios-activos', ( payload ) => {
        console.log(payload)
    })

    socketServer.on('recibir-mensaje-priv', () => {
        
    })
}

const main = async() => {
    await validarJWT();
}

main();




// const socket = io();


async function signOut() {
    // document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=https://github.com/";

    const resp = await fetch('https://www.google.com/accounts/Logout');
    // var auth2 = gapi.auth2;
    // console.log(auth2)
    // auth2.signOut().then(function() {
    //     console.log('User signed out.');
    // });
    
    // borrar token del localstorage 
    // localStorage.removeItem('token');
    // window.location = './index.html';
}