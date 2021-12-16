//1.IMPORTACIONES
const express = require("express");
const router = express.Router();
const storeController = require("./../controllers/storeController");
//2.RUTEO

//CREAR UNA STORE
router.post("/create", storeController.postCreateStore);

//lEER STORES
router.get("/readall", storeController.getReadAll);

//LEER UNA STORE
router.get("/readone/:id", storeController.getOneStore);

//EDITAR UNA STORE
router.put("/edit/:id", storeController.edit);

//3.EXPORTACION
module.exports = router;
