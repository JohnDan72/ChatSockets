
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
    localStorage.setItem('token', nuevo_token );
    document.title = nombre;

    await conectarSocket();
}

const conectarSocket = async() => {
    socketServer = io({
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

    socketServer.on('recibir-mensaje', recibirMensaje);

    socketServer.on('usuarios-activos', dibujarUsuarios)

    socketServer.on('recibir-mensaje-priv', (payload) => {
        console.log(payload);
        
    })
}

// listar usuarios conectados
const dibujarUsuarios = ( usuarios = [] ) => {
    console.log(usuarios);
    
    let usersHTLM = '';

    usuarios.forEach((elem,ind) => {
        usersHTLM+= `
            <li>
                <p>
                    <h5 class="text-success"> ${elem.nombre} </h5>
                    <span>${elem.uid}</span>
                </p>
            </li>
        `;
    });
    ulSsuarios.innerHTML = usersHTLM;
}

// listener para input mensaje
txt_mensaje.addEventListener('keypress', ({ keyCode }) => {
    const mensaje = txt_mensaje.value;
    const uid = txt_uid.value;


    if( keyCode !== 13){ return true; }
    if(mensaje.trim().length === 0){return false;}

    socketServer.emit('enviar-mensaje', { uid , mensaje } );
    txt_mensaje.value = '';
});

// recibir mensaje
const recibirMensaje = ( mensajes = [] ) => {
    console.log(mensajes);

    let mensajeHTML = '';
    mensajes.forEach( ({ nombre , mensaje , uid}) => {
        mensajeHTML+= `
            <li>
                <p>
                    <span class="text-primary"> ${nombre}: </span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;

    });

    ulMensajes.innerHTML = mensajeHTML;
    
}



const main = async() => {
    await validarJWT();
}





// const socket = io();


function signOut() {
    localStorage.removeItem('token');

    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then( () => {
        console.log('User signed out.');
        window.location = 'index.html';
    });
}

(()=>{
    gapi.load('auth2', () => {
        gapi.auth2.init();
        main();
    });
})();