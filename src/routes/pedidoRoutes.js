const express = require ("express");
const router = express.Router();
const { pedidoController } = require("../controllers/pedidoController");

/**
 * Define as rotas relacionadas aos pedidos
 * @module pedidoRoutes
 * @description
 * - GET /pedidos -> Lista todos os pedidos do banco de dados
 * - POST /pedidos -> Cria um novo pedido e os seus intens com dados envidados pelo cliente HTTP
 * @throws 
 */

router.get('/pedidos', pedidoController.listarPedidos);
router.post ("/pedidos", pedidoController.criarPedido);
router.put('/pedidos/statusEntrega/:idPedido', pedidoController.atualizarStatus); // Atualiza somente o status da entrega (por exemplo: se está "em trânsito" )
router.put('/pedidos/:idPedido', pedidoController.atualizarPedido); // Atualiza somente o status do pedido(por exemplo : se está "cancelado")
router.delete("/pedidos/:idPedido", pedidoController.deletarPedido);


module.exports = {pedidoRoutes: router};
