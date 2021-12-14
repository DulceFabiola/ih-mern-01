const bcryptjs = require("bcryptjs");
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
exports.create = async (req, res) => {
  //Creacion de usuarios
  //1.OBTENER USUARIO, EMAIL Y PASSWORD DEL FORMULARIO (REQ)

  const { nombre, apellido, pais, direccion, email, password } = req.body;

  //2A. REALIZAR EL PROCESO ASINCRONO
  try {
    //3.GENERAR PASSWORD PARA BASE DE DATOS
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //4.CREAR USUARIO EN BASE DE DATOS
    const newUser = await User.create({
      nombre,
      apellido,
      pais,
      direccion,
      email,
      //nombre de la prop del modelo:passwordEncriptado
      password: hashedPassword,
    });

    //5.AUTENTICACION CON TOKENS
    //A.CREAR UN PAYLOAD (INFORMACION DEL USUARIO)
    const payload = {
      user: {
        id: newUser._id, //ID DE MONGOBD DEL USUARIO
      },
    };

    //B. FIRMAR EL TOKEN
    jwt.sign(
      payload, // DATOS QUE ACOMPAÑARAN AL TOKEN
      process.env.SECRET, // PALABRA SECRETA (FIRMA)
      {
        expiresIn: 360000, // EXPIRACIÓN DEL TOKEN
      },
      (error, token) => {
        if (error) throw error;

        res.json({
          msg: "Token correctamente generado.",
          data: token,
        });
      }
    );
  } catch (error) {
    //2B. EN CASO DE ERROR CON AWAIT
    res.status(500).json({
      msg: "Hubo un error con la creacion de usuario",
      error: error,
    });
  }
};

//INICIAR SESION
//AUTENTICAR QUE EL EMAIL Y CONTRASENA QUE PASE LA PERSONA COINCIDAN Y SE LE ENVIA UN TOKEN

exports.login = async (req, res) => {
  //1.Obtener el Email y el Passworddel formulario (JSON)
  const { email, password } = req.body;

  try {
    //2.Encontrar un usuario en BD
    const foundUser = await User.findOne({ email });
    //3.Validacion-Si no hubo un usuario...

    if (!foundUser) {
      return res.status(400).json({
        msg: "El usuario o la contraseña son incorrectos",
      });
    }

    //4.SI TODO OK, EL USUARIO FUE ENCONTRADO, ENTONCES EVALUAMOS LA CONTRASEÑA
    const verifiedPass = await bcryptjs.compare(password, foundUser.password);
    //5.VALIDAMOS SI EL PASSWORD COINCIDE...

    if (!verifiedPass) {
      return await res.status(400).json({
        msg: "El usuario o la contraseña son incorrectos",
      });
    }

    //6.SI TODO COINCIDE Y ES CORRECTO, GENERAMOS UN JSON WEB TOKEN

    //6.A ESTABLECER UN PAYLOAD (DATOS DEL USUARIO)
    const payload = {
      user: {
        id: foundUser.id,
      },
    };

    //6.B FIRMA DEL JWT
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 36000,
      },
      (error, token) => {
        if (error) throw error;
        res.json({
          msg: "Inicio de sesion exitoso",
          data: token,
        });
      }
    );
    return;
  } catch (error) {
    res.status(500).json({
      mgs: "Hubo un problema con la autenticacion",
      data: error,
    });
  }
};

//VERIFICAR USUARIO
//CUANDO ESTAMOS ACCEDIENDO A DIFERENTES RUTAS, PREGUNTAR SI EL USUARIO TIENE PERMISOS O NO
//PAR CONFIRMARLO SE LE PIDE EL TOKEN
//UNA RUTA QUE PIDE TOKENS PARA VERIFICARLO
exports.verifyToken = async (req, res) => {
  //DESECRIPTAR EL PROCESO DEL TOKEN
  try {
    //1.BUSCAR EL ID DEL USUARIO (DEL TOKEN ABIERTO) EN BASE DE DATOS
    //pasar el token sin contrasena

    const foundUser = await User.findById(req.user.id).select("-password");

    return res.json({
      msg: "Datos de usuario encontrado",
      data: foundUser,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error con el usuario",
    });
  }
};
