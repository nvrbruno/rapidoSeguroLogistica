const { entregaModel } = require("../models/entregaModel");
const { pedidoModel } = require("../models/pedidoModel");

const entregaController = {
  // ============================
  // LISTAR ENTREGAS
  // ============================
  /**
   * Controlador responsável por listar entregas.
   * @async
   * @function listarEntregas
   * @param {object} req - Objeto da requisição contendo filtros via query.
   * @param {object} res - Objeto da resposta do servidor.
   * @returns {Promise<void>} Retorna uma lista de entregas ou uma única entrega.
   */

  listarEntregas: async (req, res) => {
    try {
      const { idEntrega } = req.query;

      // Se veio idEntrega → buscar só uma
      if (idEntrega) {
        if (idEntrega.length !== 36) {
          return res.status(400).json({ erro: "ID da entrega inválido!" });
        }

        const entrega = await entregaModel.buscarUmPorIdEntrega(idEntrega);

        if (!entrega || entrega.length === 0) {
          return res.status(404).json({ erro: "Entrega não encontrada." });
        }

        return res.status(200).json(entrega);
      }

      // Sem filtro → listar todas
      const entregas = await entregaModel.buscarTodos();
      return res.status(200).json(entregas);
    } catch (error) {
      console.error("Erro ao listar entregas:", error);
      return res.status(500).json({ erro: "Erro ao listar entregas." });
    }
  },

  // ============================
  // ATUALIZAR STATUS DA ENTREGA E PEDIDO USANDO idEntrega
  // ============================
  /**
   * @async
   * @function atualizarStatus
   * @param {object} req - Objeto da requisição contendo idEntrega nos parâmetros e statusEntrega no corpo da requisição.
   * @param {object} res - Objeto da resposta do servidor.
   * @returns {Promise<void>} Retorna mensagem de sucesso ao atualizar o status.
   */

  atualizarStatus: async (req, res) => {
    try {
      const { idEntrega } = req.params;
      const { statusEntrega } = req.body;

      // Validar ID
      if (!idEntrega || idEntrega.length !== 36) {
        return res.status(400).json({ erro: "ID da entrega inválido." });
      }

      // Validar status da entrega
      if (!statusEntrega) {
        return res.status(400).json({
          erro: "statusEntrega é obrigatório.",
        });
      }

      // Buscar entrega pelo idEntrega
      const entrega = await entregaModel.buscarUmPorIdEntrega(idEntrega);

      if (!entrega || entrega.length === 0) {
        return res.status(404).json({ erro: "Entrega não encontrada." });
      }

      // Atualizar SOMENTE o status da entrega
      await entregaModel.atualizarSomenteEntrega(idEntrega, statusEntrega);

      return res.status(200).json({
        message: "Status da entrega atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar status da entrega:", error);
      return res
        .status(500)
        .json({ erro: "Erro interno ao atualizar status." });
    }
  },
};

module.exports = { entregaController };
