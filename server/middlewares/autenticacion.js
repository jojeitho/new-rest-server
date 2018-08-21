const jwt = require('jsonwebtoken');


/*=======================
   verificar token
   ======================*/

let verificarToken = (req, res, next) => {

    let token = req.get('token');
    console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => { ////verifica el token si fue correcto

        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token erroneo consulte al administrador'
            });
        }

        req.usuario = decoded.usuario; ///compara si el token desencriptado es igual a lo que tenemos en el req.usuario
        next();
    });
};

/*=======================
     verificar rol
  =====================*/
let verificarUSER_ROLE = (req, res, next) => {

    let usuario = req.usuario;


    if (usuario.role === 'ADMIN') {
        next();
        return;

    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }


};

module.exports = {
    verificarToken,
    verificarUSER_ROLE
}