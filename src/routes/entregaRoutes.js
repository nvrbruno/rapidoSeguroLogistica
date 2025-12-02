const express = require("express");
const router = express.Router();
const { entregaController } = require("../controllers/entregaController");

router.get("/entregas", entregaController.listarEntregas);

router.put("/entregas/statusEntrega/:idEntrega",entregaController.atualizarStatus);

module.exports = { entregaRoutes: router };
