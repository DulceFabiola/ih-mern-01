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
