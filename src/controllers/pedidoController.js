const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require("../models/clienteModel");

const pedidoController = {
  /**
   * Controlador lista todos os pedidos do banco de dados
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
      const pedidos = await pedidoModel.buscarTodos(); // Busca todos os pedidos no banco de dados

      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error); // Caso haja erro ao listar pedidos, retorna ao usuário
      res
        .status(500)
        .json({ erro: " Erro interno no servidor ao listar pedidos !" });
    }
  },

  /**
   * Controlador responsável pela criação de um novo pedido.
   * @async
   * @function criarPedido
   * @param {object} req - Objeto da requisição contendo os dados do pedido.
   * @param {object} res - Objeto da resposta do servidor.
   * @returns {Promise<void>} Retorna mensagem de sucesso ao criar o pedido.
   */

  criarPedido: async (req, res) => {
    try {
      const {
        idCliente,
        dataPedido,
        tipoPedido,
        distanciaPedido,
        pesoPedido,
        valorBaseKm,
        valorBaseKg,
      } = req.body; // Desestrutura os dados do corpo da requisição

      if (
        idCliente == undefined ||
        dataPedido == undefined ||
        tipoPedido == undefined ||
        distanciaPedido == undefined ||
        pesoPedido == undefined ||
        valorBaseKm == undefined ||
        valorBaseKg == undefined
      ) {
        // Verifica se todos os campos obrigatórios estão preenchidos
        return res
          .status(400)
          .json({ erro: "Campos obrigatórios não preeenchidos !" }); // Caso não estajam retorna o seguinte erro
      }

      const cliente = await clienteModel.buscarUm(idCliente); // Verifica se o cliente existe
      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ erro: "Cliente não encontrado!" });
      }

      // Cálculos para o valor final
      let valorDistancia = distanciaPedido * valorBaseKm;
      let valorPeso = pesoPedido * valorBaseKg;
      let valorBase = valorDistancia + valorPeso;

      let acrescEntrega = 0;
      let descEntrega = 0;
      let taxaExtra = 0;

      // Ajustes no valor com base no tipo de pedido e condições específicas
      if (tipoPedido.length == 7) {
        // Se o pedido for "urgente"
        acrescEntrega = valorBase * 0.2;
        valorBase = valorBase + acrescEntrega;
      }

      if (valorBase > 500) {
        // Se o valor ultrapassar 500, aplica desconto
        descEntrega = valorBase * 0.1;
        valorBase = valorBase - descEntrega;
      }

      if (pesoPedido > 50) {
        // Se o peso for maior que 50, aplica taxa extra
        taxaExtra = 15;
        valorBase = valorBase + taxaExtra;
      }

      // Insere o novo pedido no banco de dados
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

  /**
   * Controlador para atualizar os dados de um pedido existente.
   *  @async
   * @function atualizarPedido
   * @param {object} req - Objeto da requisição contendo idPedido em params e dados atualizados no body.
   * @param {object} res - Objeto da resposta do servidor.
   * @returns {Promise<void>} Retorna mensagem de sucesso caso o pedido seja atualizado.
   */

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
      } = req.body; // Extrai os dados do corpo da requisição

      if (idPedido.length != 36) {
        // Verifica se o pedido existe
        return res.status(400).json({ Erro: "Id do pedido inválido" });
      }
      let result = await pedidoModel.buscarUm(idPedido);

      if (!result || result.length <= 0) {
        return res.status(400).json({ Erro: "Esse pedido não existe" });
      }

      const pedidoAntigo = result[0]; // Recupera o pedido antigo

      result = await pedidoModel.buscarEntrega(pedidoAntigo.idPedido);

      const entrega = result[0];

      if (idCliente) {
        if (idCliente.length != 36) {
          // Verifica se o tamanho do id é maior ou igual
          return res.status(400).json({ erro: "Id cliente Inválido!" });
        }

        const cliente = await clienteModel.buscarUm(idCliente);

        if (!cliente || cliente.length === 0) {
          return res.status(404).json({ erro: "Cliente não encontrado!" });
        }
      }

      // Atualiza os valores de distância e peso, levando em consideração os valores antigos ou os novos valores passados
      const valorDistanciaAtualizado =
        distanciaPedido && valorBaseKm
          ? distanciaPedido * valorBaseKm // Se o novo valor de distância e base de valor de km foram passados
          : distanciaPedido
          ? distanciaPedido * pedidoAntigo.valorBaseKm // Se somente o valor de km foi passado
          : valorBaseKm
          ? pedidoAntigo.distanciaPedido * valorBaseKm // Se somente o valor de base de km foi passado
          : entrega.valorDistancia;

      const valorPesoAtualizado =
        pesoPedido && valorBaseKg
          ? pesoPedido * valorBaseKg // Se o novo valor de peso e base de valor de kg foram passados
          : pesoPedido
          ? pesoPedido * pedidoAntigo.valorBaseKg // Se somente o valor de peso foi passado
          : valorBaseKg
          ? pedidoAntigo.pesoPedido * valorBaseKg // Se somente o valor de base de kg foi passado
          : entrega.valorPeso; // Se nenhum valor for passado, mantém o valor antigo

      // Calcula o valor base do pedido com base na distância e peso
      let valorBaseAtualizado = valorDistanciaAtualizado + valorPesoAtualizado; // Calcula o valor base do pedido com base na distância e peso
      const idClienteAtualizado = idCliente ?? pedidoAntigo.idCliente;
      const dataPedidoAtualizado = dataPedido ?? pedidoAntigo.dataPedido;
      const tipoPedidoAtualizado = tipoPedido ?? pedidoAntigo.tipoPedido;
      const distanciaPedidoAtualizado =
        distanciaPedido ?? pedidoAntigo.distanciaPedido;
      const pesoPedidoAtualizado = pesoPedido ?? pedidoAntigo.pesoPedido;
      const valorBaseKmAtualizado = valorBaseKm ?? pedidoAntigo.valorBaseKm;
      const valorBaseKgAtualizado = valorBaseKg ?? pedidoAntigo.valorBaseKg;

      // Verifica se o tipo de pedido é válido (urgente ou normal)
      if (
        tipoPedidoAtualizado.toLowerCase() !== "urgente" &&
        tipoPedidoAtualizado.toLowerCase() !== "normal"
      ) {
        return res.status(400).json({ erro: "Tipo de pedido inválido!" });
      }

      // Calcula os ajustes no valor do pedido (acréscimo, desconto e taxa extra) com base no tipo e outros critérios
      let acrescEntregaAtualizado = entrega.acrescEntrega;
      if (tipoPedidoAtualizado.toLowerCase() === "urgente") {
        valorBaseAtualizado += valorBaseAtualizado * 0.2; // Aumento de 20% se o pedido for urgente
        acrescEntregaAtualizado = valorBaseAtualizado * 0.2;
      }

      let descEntregaAtualizado = entrega.descEntrega;
      if (valorBaseAtualizado > 500) {
        valorBaseAtualizado -= valorBaseAtualizado * 0.1; // Desconto de 10% se o valor for superior a 500
        descEntregaAtualizado = valorBaseAtualizado * 0.1;
      }

      let taxaExtraAtualizado = entrega.taxaExtra;
      if (pesoPedidoAtualizado > 50) {
        valorBaseAtualizado += 15; // Taxa extra de 15 se o peso for maior que 50
        taxaExtraAtualizado = 15;
      }

      let valorFinalAtualizado = valorBaseAtualizado; // Valor final atualizado

      // Atualiza o pedido no banco de dados
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

  /**
   * Controlador para deletar um pedido do banco de dados.
   *  @async
   * @function deletarPedido
   * @param {object} req - Objeto da requisição contendo o idPedido nos parâmetros.
   * @param {object} res - Objeto da resposta do servidor.
   * @returns {Promise<void>} Retorna mensagem de sucesso caso o pedido seja deletado.
   */

  deletarPedido: async (req, res) => {
    try {
      const { idPedido } = req.params;

      // Verifica se o ID do pedido é válido
      if (idPedido.length != 36) {
        return res.status(400).json({ Erro: "Id do pedido inválido" });
      }
      const result = await pedidoModel.buscarUm(idPedido);

      // Verifica se o pedido existe
      if (!result || result.length <= 0) {
        return res.status(400).json({ Erro: "Esse pedido não existe" });
      }

      // Deleta o devido pedido
      await pedidoModel.deletarPedido(idPedido);
      res.status(200).json({ message: "Pedido excluído com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro no servidor ao excluir o pedido." });
    }
  },
};

module.exports = { pedidoController };
