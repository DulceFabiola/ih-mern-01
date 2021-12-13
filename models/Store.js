//1.IMPORTACIONES
const mongoose = require("mongoose");

//2.SCHEMA
const storeSchema = mongoose.Schema({
  domicilio: {
    type: String,
    require: true,
  },
  telefono: {
    type: String,
  },
});

//3.MODELOS
const Store = mongoose.model("Store", storeSchema);

//EXPORTACION
module.exports = Store;
