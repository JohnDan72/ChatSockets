let usuario = null;
let socket = null;
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
    const socket = io({
        'extraHeaders': {
            'auth-token': localStorage.getItem('token')
        }
    });
}

const main = async() => {
    await validarJWT();
}

main();


// const socket = io();