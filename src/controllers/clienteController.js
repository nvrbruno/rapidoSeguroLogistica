const { clienteModel } = require("../models/clienteModel");

const clienteController = {
  //---------------------------
  //LISTAR TODOS OS CLIENTES
  //GET /CLIENTES
  //---------------------------

  /**
   * Controlador responsável por listar clientes.
   *  * @async
   * @function listarClientes
   * @param {object} req - Objeto da requisição contendo idCliente em req.query.
   * @param {object} res - Objeto da resposta do servidor.
   * @returns {Promise<void>} Retorna uma lista de clientes ou apenas um cliente filtrado.
   * @throws Retorna erro 400 se o idCliente tiver formato inválido.
   */

  listarClientes: async (req, res) => {
    try {
      const { idCliente } = req.query;

      if (idCliente) {
        if (idCliente.length != 36) {
          // Verifica o tamanho do id do cliente caso seja diferente de 36
          return res.status(400).json({ erro: `id do cliente invalido!` }); // Resulta no seguinte erro
        }
        const cliente = await clienteModel.buscarUm(idCliente); // Dentre todos os clientes busca apenas um

        return res.status(200).json(cliente);
      }
      const clientes = await clienteModel.buscarTodos(); //busca todos

      res.status(200).json(clientes);
    } catch (error) {
      console.error("Erro ao listar os clientes:", error);
      res.status(500).json({ message: "Erro ao buscar os clientes." });
    }
  },

  //---------------------------
  //ADICIONAR CLIENTES
  //POST /CLIENTES
  //---------------------------
  /**
   * Controlador responsável por cadastrar um novo cliente.
   * * @async
   * @function criarCliente
   * @param {object} req - Objeto da requisição contendo dados do cliente no corpo.
   * @param {object} res - Objeto da resposta do servidor.
   * @returns {Promise<void>} Retorna mensagem de sucesso ao cadastrar o cliente.
   * @throws Retorna erro 400 caso algum campo obrigatório esteja ausente.
   */

  criarCliente: async (req, res) => {
    try {
      const {
        nomeCliente,
        cpfCliente,
        foneCliente,
        emailCliente,
        enderecoCliente,
      } = req.body;
      if (
        nomeCliente === undefined ||
        cpfCliente == undefined ||
        foneCliente == undefined ||
        emailCliente == undefined ||
        enderecoCliente == undefined
      ) {
        // Verifica se todos os campos acimas estão preeenchidos
        return res
          .status(400)
          .json({ erro: "Campos obrigatorios não preenchidos" }); //Se não esiverem preechidos retorna o seguinte erro
      }
      const clientesCPF = await clienteModel.buscarCPF(cpfCliente);

      if (clientesCPF.length > 0) {
        return res.status(409).json({ erro: "Esse CPF já está cadastrado" });
      }

      const clientesEmail = await clienteModel.buscarEMAIL(emailCliente);

      if (clientesEmail.length > 0) {
        return res.status(409).json({ erro: "Esse EMAIL já está cadastrado" });
      }

      await clienteModel.inserirCliente(
        nomeCliente,
        cpfCliente,
        foneCliente,
        emailCliente,
        enderecoCliente
      ); // Inserindo um cliente

      res.status(201).json({ message: "cliente cadastrado com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar o cliente:", error);
      res.status(500).json({ erro: "Erro no servidor ao cadastrar cliente!" });
    }
  },

  /**
   * Controlador responsável por atualizar os dados de um cliente existente.
   * @async
   * @function atualizarCliente
   * @param {object} req - Objeto da requisição contendo idCliente em req.params e dados no corpo.
   * @param {object} res - Objeto da resposta do servidor.
   * @returns {Promise<void>} Retorna mensagem de sucesso ao atualizar os dados do cliente.
   * @throws Retorna erro 400 caso o idCliente não seja válido.
   */

  atualizarCliente: async (req, res) => {
    try {
      const { idCliente } = req.params;
      const {
        nomeCliente,
        foneCliente,
        emailCliente,
        enderecoCliente,
        cpfCliente,
      } = req.body;

      if (!idCliente || idCliente.length !== 36) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const cliente = await clienteModel.buscarUm(idCliente); // Busca o cliente através dp cpf

      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ erro: "Cliente não encontrado!" });
      }

      const clienteAtual = cliente[0];

      const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente; //Atualiza os dados antigos do cliente, para os dados atuais
      const cpfAtualizado = cpfCliente ?? clienteAtual.cpfCliente;
      const foneAtualizado = foneCliente ?? clienteAtual.foneCliente;
      const emailAtualizado = emailCliente ?? clienteAtual.emailCliente;
      const enderecoAtualizado =
        enderecoCliente ?? clienteAtual.enderecoCliente;

      await clienteModel.atualizarCliente(
        //Atualizar dados do cliente
        nomeAtualizado,
        cpfAtualizado,
        foneAtualizado,
        emailAtualizado,
        enderecoAtualizado,
        idCliente
      );

      return res
        .status(200)
        .json({ mensagem: "Cliente atualizado com sucesso!" }); // Retorna a mensagem caso tenha sido atualizado com sucesso
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ erro: "Erro no servidor ao atualizar cliente." });
    }
  },

  /**
 * Controlador responsável por deletar um cliente.
 *  @async
 * @function deletarCliente
 * @param {object} req - Objeto da requisição contendo idCliente em req.params.
 * @param {object} res - Objeto da resposta do servidor.
 * @returns {Promise<void>} Retorna mensagem de sucesso ao deletar o cliente.
 * @throws Retorna erro 400 caso o ID seja inválido.
 */
  deletarCliente: async (req, res) => {
    try {
      const { idCliente } = req.params;

      // Verificação das regras
      if (!idCliente || idCliente.length !== 36) {
        return res.status(400).json({ erro: "ID do cliente inválido." });
      }

      // Verifica se o cliente existe
      const cliente = await clienteModel.buscarUm(idCliente);

      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ erro: "Este cliente não existe." });
      }

      // Verifica se o cliente tem pedidos vinculados
      const pedidos = await clienteModel.buscarPedidosPorCliente(idCliente);

      if (pedidos.length > 0) {
        return res.status(409).json({
          erro: "Não é possível deletar o cliente, pois ele possui pedidos vinculados.",
        });
      }

      await clienteModel.deletarCliente(idCliente);

      return res
        .status(200)
        .json({ mensagem: "Cliente deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      return res.status(500).json({
        erro: "Erro interno no servidor ao tentar deletar o cliente.",
      });
    }
  },
};

module.exports = { clienteController };
