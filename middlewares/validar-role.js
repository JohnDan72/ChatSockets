const { request, response } = require("express");


const validaRole = ( req = request, res = response, next) => {
    const {usuario_solicitante} = req

    if(!usuario_solicitante){
        return res.status(500).json({
            msg: 'no existe el usuario'
        })
    }

    const {role, nombre} = usuario_solicitante;
    if( role != 'ADMIN_ROLE'){
        return res.status(500).json({
            msg: `El usuario ${nombre} NO tiene los permisos suficientes para esta acción`
        })
    }

    next();
}

// middleware sin req y response
const tieneRole = ( ...roles ) => {
    return (req,res,next) => {
        if(!req.usuario_solicitante){
            return res.status(500).json({
                msg: 'no existe el usuario'
            })
        }
        if(!roles.includes(req.usuario_solicitante.role)){
            return res.status(401).json({
                msg: `El usuario no cuenta con algún rol necesario ${roles}`
            })
        }
        console.log(roles);
        
        next();
    }
}

module.exports = {
    validaRole,
    tieneRole
}