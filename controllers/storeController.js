const Store = require("./../models/Store");
exports.postCreateStore = async (req, res) => {
  const { domicilio, telefono } = req.body;
  try {
    const newStore = await Store.create({
      domicilio,
      telefono,
    });

    res.json({
      msg: "Store creada con éxito",
      data: newStore,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error creando la Store",
      error: error,
    });
  }
};

//LEER STORES

exports.getReadAll = async (req, res) => {
  try {
    //trae toda la data q encuentres, sin aplicar ningun filtro
    const stores = await Store.find({});
    res.json({
      msg: "Stores obtenidas con éxito ",
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error obteniendo los datos",
      error: error,
    });
  }
};

//LEER UNA STORE
exports.getOneStore = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await Store.findById(id);
    res.json({
      msg: "Store obtenida con éxito",
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      msg: "hubo un error obteniendo los datos.",
      error: error,
    });
  }
};
