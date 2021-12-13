//1.IMPORTACIONES
const express = require("express");
const router = express.Router();
const guitarController = require("./../controllers/guitarController");
//2.RUTEO

//CREAR GUITARRA
router.post("/create", guitarController.create);

//lEER GUITARRAS
router.get("/readall", guitarController.readAll);

//LEER UNA GUITARRA
router.get("/readone/:id", guitarController.readOne);

//EDITAR UNA GUITARRA
router.put("/edit/:id", guitarController.edit);

//BORRAR UNA GUITARRA
router.delete("/delete/:id", guitarController.delete);

//3.EXPORTACION
module.exports = router;
