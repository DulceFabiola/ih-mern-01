//IMPORTACIONES
const Guitar = require("./../models/Guitar");

exports.create = async (req, res) => {
  //Obtener los datos del formulario
  const { nombre, precio, color, imagen, descripcion } = req.body;

  //Para crear una guitarra, hay q importar el modelo
  //utilizamos un try/catch

  try {
    const newGuitar = await Guitar.create({
      nombre,
      precio,
      color,
      imagen,
      descripcion,
    });
    //Devolver una respuesta en un formato JSON
    res.json({
      msg: "Guitarra creada con éxito",
      data: newGuitar,
    });
  } catch (error) {
    //error en server
    res.status(500).json({
      msg: "Hubo un error creando la guitarra",
      //  error: error, o solo puedes dejarlo como error, ya que tienen el mismo nombre
      error: error,
    });
  }
};

exports.readAll = async (req, res) => {
  try {
    const guitars = await Guitar.find({});
    res.json({
      msg: "Guitarras obtenidas con éxito",
      data: guitars,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error obteniendo los datos",
      error: error,
    });
  }
};

exports.readOne = async (req, res) => {
  //obtener los parametros
  //de la url vamos a obtener datos
  const { id } = req.params;

  try {
    const guitar = await Guitar.findById(id);
    res.json({
      msg: "Guitarra obtenida con éxito",
      data: guitar,
    });
  } catch (error) {
    res.status(500).json({
      msg: "hubo un error obteniendo los datos.",
      error: error,
    });
  }
};

//EDITAR UNA GUITARRA

exports.edit = async (req, res) => {
  //obtiene el dato de la url
  const { id } = req.params;

  //obtiene datos del body
  const { nombre, precio, color, imagen, descripcion } = req.body;
  try {
    const updateGuitar = await Guitar.findByIdAndUpdate(
      id,
      {
        nombre,
        precio,
        color,
        imagen,
        descripcion, //Propiedades a cambiar
      },
      { new: true }
    );
    res.json({
      msg: "Guitarra actualizada con éxito",
      data: updateGuitar,
    });
  } catch (error) {
    res.status(500).json({
      msg: "hubo un error actualizando los datos.",
      error: error,
    });
  }
};

//BORRAR UNA GUITARRA
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGuitar = await Guitar.findByIdAndRemove({ _id: id });
    res.json({
      msg: "Guitarra borrada con éxito",
      data: deletedGuitar,
    });
  } catch (error) {
    res.json({
      msg: "Hubo un error borrando la guitarra.",
      error: error,
    });
  }
};
