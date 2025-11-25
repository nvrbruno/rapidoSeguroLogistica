const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require("../models/clienteModel");

const pedidoController = {
  /**
   * COntrolador lista todos os pedidos do banco de dados
   *
   * @async
   * @function listarPedidos
   * @param {object} req -Objeto da requisição(recebido do cliente http)
   * @param {object} res - Objeto da resposta do servidor( enviado ao cliente http)
   * @returns {Promise<void>} Restorna uma resposta JSON com a lista de pedidos.
   * @throws Mostra no console e retorna tambem erro 500 se ocorrer falha ao buscar os pedidos
   */
  listarPedidos: async (req, res) => {
    try {
      const pedidos = await pedidoModel.buscarTodos();

      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res
        .status(500)
        .json({ erro: " Erro interno no servidor ao listar pedidos !" });
    }
  },

  criarPedido: async (req, res) => {
    try {
      const {
        idCliente,
        cpfCliente,
        dataPedido,
        tipoPedido,
        distanciaPedido,
        pesoPedido,
        valorBaseKm,
        valorBaseKg,
      } = req.body;

      if (
        idCliente == undefined ||
        cpfCliente == undefined ||
        dataPedido == undefined ||
        tipoPedido == undefined ||
        distanciaPedido == undefined ||
        pesoPedido == undefined ||
        valorBaseKm == undefined ||
        valorBaseKg == undefined
      ) {
        return res
          .status(400)
          .json({ erro: "Campos obrigatórios não preeenchidos !" });
      }

      if (!cpfCliente || cpfCliente.length !== 11) {
        return res.status(400).json({ erro: "CPF inválido!" });
      }

      const cliente = await clienteModel.buscarCPF(cpfCliente);

      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ erro: "Cliente não encontrado!" });
      }

      let valorDistancia = distanciaPedido * valorBaseKm;
      let valorPeso = pesoPedido * valorBaseKg;
      let valorBase = valorDistancia + valorPeso;

      let acrescEntrega = 0;
      let descEntrega = 0;
      let taxaExtra = 0;

      if (tipoPedido.length == 7) {
        acrescEntrega = valorBase * 0.2;
        valorBase = valorBase + acrescEntrega;
      }

      if (valorBase > 500) {
        descEntrega = valorBase * 0.1;
        valorBase = valorBase - descEntrega;
      }

      if (pesoPedido > 50) {
        taxaExtra = 15;
        valorBase = valorBase + taxaExtra;
      }

      await pedidoModel.inserirPedido(
        idCliente,
        dataPedido,
        tipoPedido,
        distanciaPedido,
        pesoPedido,
        valorBaseKm,
        valorBaseKg,
        valorBase,
        valorDistancia,
        valorPeso,
        acrescEntrega,
        descEntrega,
        taxaExtra
      );

      res.status(201).json({ message: "Pedido cadastrado com sucesso" });
    } catch (error) {
      console.error("Erro ao cadastrar pedido:", error);
      res
        .status(500)
        .json({ erro: "Erro interno no servidor ao cadastrar pedido !" });
    }
  },

  atualizarPedido: async (req, res) => {
    try {
      const { idPedido } = req.params;

      const {
        idCliente,
        dataPedido,
        tipoPedido,
        distanciaPedido,
        pesoPedido,
        valorBaseKm,
        valorBaseKg,
      } = req.body;

      if (idPedido.length != 36) {
        return res.status(400).json({ Erro: "Id do pedido inválido" });
      }
      const result = await pedidoModel.buscarUm(idPedido);

      if (!result || result.length <= 0) {
        return res.status(400).json({ Erro: "Esse pedido não existe" });
      }

      const pedidoAntigo = result[0];

      const entrega = pedidoModel.buscarEntrega(pedidoAntigo.idPedido);

      if (idCliente) {
        if (idCliente.length != 36) {
          return res.status(400).json({ erro: "Id cliente Inválido!" });
        }

        const cliente = await clienteModel.buscarUm(idCliente);

        if (!cliente || cliente.length === 0) {
          return res.status(404).json({ erro: "Cliente não encontrado!" });
        }
      }

      const valorDistanciaAtualizado =
        distanciaPedido && valorBaseKm
          ? distanciaPedido * valorBaseKm
          : distanciaPedido
          ? distanciaPedido * pedidoAntigo.valorBaseKm
          : valorBaseKm
          ? pedidoAntigo.distanciaPedido * valorBaseKm
          : entrega.valorDistancia;

      const valorPesoAtualizado =
        pesoPedido && valorBaseKg
          ? pesoPedido * valorBaseKg
          : pesoPedido
          ? pesoPedido * pedidoAntigo.valorBaseKg
          : valorBaseKg
          ? pedidoAntigo.pesoPedido * valorBaseKg
          : pedidoAntigo.valorPeso;

      let valorBaseAtualizado = valorDistanciaAtualizado + valorPesoAtualizado;
      const idClienteAtualizado = idCliente ?? pedidoAntigo.idCliente;
      const dataPedidoAtualizado = dataPedido ?? pedidoAntigo.dataPedido;
      const tipoPedidoAtualizado = tipoPedido ?? pedidoAntigo.tipoPedido;
      const distanciaPedidoAtualizado =
        distanciaPedido ?? pedidoAntigo.distanciaPedido;
      const pesoPedidoAtualizado = pesoPedido ?? pedidoAntigo.pesoPedido;
      const valorBaseKmAtualizado = valorBaseKm ?? pedidoAntigo.valorBaseKm;
      const valorBaseKgAtualizado = valorBaseKg ?? pedidoAntigo.valorBaseKg;

      if (
        tipoPedidoAtualizado.toLowerCase() !== "urgente" &&
        tipoPedidoAtualizado.toLowerCase() !== "normal"
      ) {
        return res.status(400).json({ erro: "Tipo de pedido inválido!" });
      }

      let acrescEntregaAtualizado = entrega.acrescEntrega;
      if (tipoPedidoAtualizado.toLowerCase() === "urgente") {
        valorBaseAtualizado += valorBaseAtualizado * 0.2;
        acrescEntregaAtualizado = valorBaseAtualizado * 0.2;
      }

      let descEntregaAtualizado = entrega.descEntrega;
      if (valorBaseAtualizado > 500) {
        valorBaseAtualizado -= valorBaseAtualizado * 0.1;
        descEntregaAtualizado = valorBaseAtualizado * 0.1;
      }

      let taxaExtraAtualizado = entrega.taxaExtra;
      if (pesoPedidoAtualizado > 50) {
        valorBaseAtualizado += 15;
        taxaExtraAtualizado = 15;
      }

      let valorFinalAtualizado = valorBaseAtualizado;

      await pedidoModel.atualizarPedido(
        idPedido,
        idClienteAtualizado,
        dataPedidoAtualizado,
        tipoPedidoAtualizado,
        distanciaPedidoAtualizado,
        pesoPedidoAtualizado,
        valorBaseKmAtualizado,
        valorBaseKgAtualizado,
        valorDistanciaAtualizado,
        valorPesoAtualizado,
        acrescEntregaAtualizado,
        taxaExtraAtualizado,
        descEntregaAtualizado,
        valorFinalAtualizado
      );

      res.status(200).json({ message: "Pedido atualizado com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro interno ao atualizar pedido!" });
    }
  },

  atualizarStatus: async (req, res) => {
    try {
      const { idPedido } = req.params;
      const { statusPedido } = req.body;
      if (!idPedido || idPedido.length !== 36) {
        return res.status(400).json({ erro: "ID do pedido inválido" });
      }

      if (!statusPedido) {
        return res.status(400).json({ erro: "Status pedido é obrigatório" });
      }

      const pedido = await pedidoModel.buscarUm(idPedido);

      if (!pedido || pedido.length !== 1) {
        return res.status(404).json({ erro: "Pedido não encontrado" });
      }
      await pedidoModel.statusPedido(idPedido, statusPedido, statusPedido);

      res.status(200).json({ message: "Pedido atualizado com sucesso." });
    } catch (error) {
      console.error("Erro ao atualizar o pedido:", error);
      res.status(500).json({ erro: "Erro interno ao atualizar o pedido." });
    }
  },

    deletarPedido: async (req, res) => {
    try {
      const { idPedido } = req.params;

      if (idPedido.length != 36) {
        return res.status(400).json({ Erro: "Id do pedido inválido" });
      }
      const result = await pedidoModel.buscarUm(idPedido);

      if (!result || result.length <= 0) {
        return res.status(400).json({ Erro: "Esse pedido não existe" });
      }

      await pedidoModel.deletarPedido(idPedido);
      res.status(200).json({ message: "Pedido excluído com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro no servidor ao excluir o pedido." });
    }
  },

};

module.exports = { pedidoController };
