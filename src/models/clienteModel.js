const { sql, getConnection } = require("../config/db");

const clienteModel = {
  /**
   * Busca todos os clientes cadastrados no banco de dados.
   *
   * @async
   * @function buscarTodos
   * @returns {Promise<Array>} Retorna um array com todos os clientes.
   * @throws Retorna erro 500 caso ocorra falha ao buscar os clientes.
   */

  buscarTodos: async () => {
    try {
      const pool = await getConnection(); //Cria conexão com o DB
      let sql = "SELECT * FROM Clientes";

      const result = await pool.request().query(sql);
      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar os clientes", error);
      throw error; // Passa o erro para o controller tratar
    }
  },

  /**
   * Busca um cliente específico pelo seu ID.
   *
   * @async
   * @function buscarUm
   * @param {string} idCliente - ID do cliente a ser buscado (UUID).
   * @returns {Promise<Array>} Retorna um array com os dados do cliente encontrado.
   * @throws Retorna erro caso ocorra falha ao buscar o cliente.
   */

  buscarUm: async (idCliente) => {
    // Busca um cliente através do id
    try {
      const pool = await getConnection();

      const querySQL = "SELECT * FROM Clientes WHERE idCliente = @idCliente";

      const result = await pool
        .request()
        .input("idCliente", sql.UniqueIdentifier, idCliente)
        .query(querySQL);
      return result.recordset;
    } catch (error) {
      console.error("erro ao buscar o Cliente.", error);
    }
  },

  /**
   * Busca clientes pelo CPF.
   *
   * @async
   * @function buscarCPF
   * @param {string} cpfCliente - CPF do cliente a ser buscado.
   * @returns {Promise<Array>} Retorna um array com os clientes que possuem o CPF informado.
   * @throws Retorna erro 500 caso ocorra falha ao buscar o CPF no banco.
   */

  buscarCPF: async (cpfCliente) => {
    try {
      const pool = await getConnection(); //Cria conexão com o DB
      let querySql = "SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente"; //faz busca do cpf

      const result = await pool
        .request()
        .input("cpfCliente", sql.VarChar(12), cpfCliente)
        .query(querySql);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar CPF do cliente", error);
      throw error; // Passa o erro para o controller tratar
    }
  },

  buscarEMAIL: async (emailCliente) => {
    try {
      const pool = await getConnection(); //Cria conexão com o Banco de Dados
      let querySql =
        "SELECT * FROM Clientes WHERE emailCliente = @emailCliente"; //Faz a busca do email do cliente

      const result = await pool
        .request()
        .input("emailCliente", sql.VarChar(50), emailCliente)
        .query(querySql);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar EMAIL do cliente", error);
      throw error; // Passa o erro para o controller tratar
    }
  },

  /**
   * Insere um novo cliente no banco de dados.
   *
   * @async
   * @function inserirCliente
   * @param {string} nomeCliente - Nome do cliente.
   * @param {string} cpfCliente - CPF do cliente.
   * @param {string} foneCliente - Telefone do cliente.
   * @param {string} emailCliente - Email do cliente.
   * @param {string} enderecoCliente - Endereço do cliente.
   * @returns {Promise<void>} Retorna verdadeiro em caso de sucesso.
   * @throws Retorna erro 500 caso ocorra falha ao inserir o cliente.
   */

  inserirCliente: async (
    nomeCliente,
    cpfCliente,
    foneCliente,
    emailCliente,
    enderecoCliente
  ) => {
    try {
      const pool = await getConnection(); //

      let querySQL =
        "INSERT INTO Clientes(nomeCliente, cpfCliente, foneCliente, emailCliente, enderecoCliente) VALUES (@nomeCliente, @cpfCliente, @foneCliente, @emailCliente, @enderecoCliente)";

      await pool
        .request()
        .input("nomeCliente", sql.VarChar(100), nomeCliente)
        .input("cpfCliente", sql.Char(11), cpfCliente)
        .input("foneCliente", sql.Char(12), foneCliente)
        .input("emailCliente", sql.VarChar(50), emailCliente)
        .input("enderecoCliente", sql.VarChar(250), enderecoCliente)
        .query(querySQL);
    } catch (error) {
      console.error("Erro ao inserir clientes:", error);
      throw error; // Passa o erro para o controller tratar
    }
  },

  /**
   * Atualiza os dados de um cliente existente.
   *
   * @async
   * @function atualizarCliente
   * @param {string} nomeCliente - Nome do cliente.
   * @param {string} cpfCliente - CPF do cliente.
   * @param {string} foneCliente - Telefone do cliente.
   * @param {string} emailCliente - Email do cliente.
   * @param {string} enderecoCliente - Endereço do cliente.
   * @param {string} idCliente - ID do cliente a ser atualizado.
   * @returns {Promise<void>} Retorna verdadeiro em caso de sucesso.
   * @throws Retorna erro 500 caso ocorra falha ao atualizar o cliente.
   */

  atualizarCliente: async (
    nomeCliente,
    cpfCliente,
    foneCliente,
    emailCliente,
    enderecoCliente,
    idCliente
  ) => {
    try {
      const pool = await getConnection(); //
      const querySQL = `
UPDATE clientes
SET 
  nomeCliente = @nomeCliente,
  foneCliente = @foneCliente,
  emailCliente = @emailCliente,
  enderecoCliente = @enderecoCliente,
  cpfCliente = @cpfCliente
WHERE idCliente = @idCliente

    `;

      await pool
        .request()
        .input("nomeCliente", sql.VarChar(100), nomeCliente)
        .input("cpfCliente", sql.Char(11), cpfCliente)
        .input("foneCliente", sql.Char(12), foneCliente)
        .input("emailCliente", sql.VarChar(50), emailCliente)
        .input("enderecoCliente", sql.VarChar(250), enderecoCliente)
        .input("idCliente", sql.UniqueIdentifier, idCliente)
        .query(querySQL);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error; // Passa o erro para o controller tratar
    }
  },

  /**
   * Busca todos os pedidos vinculados a um cliente específico.
   *
   * @async
   * @function buscarPedidosPorCliente
   * @param {string} idCliente - ID do cliente.
   * @returns {Promise<Array>} Retorna um array com os pedidos do cliente.
   * @throws Retorna erro 500 caso ocorra falha ao buscar os pedidos.
   */

  buscarPedidosPorCliente: async (idCliente) => {
    try {
      const pool = await getConnection();

      const query = `
        SELECT * FROM Pedidos
        WHERE idCliente = @idCliente
      `;

      const result = await pool
        .request()
        .input("idCliente", sql.UniqueIdentifier, idCliente)
        .query(query);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar pedidos do cliente:", error);
      throw error;
    }
  },

  /**
   * Deleta um cliente do banco de dados.
   *
   * @async
   * @function deletarCliente
   * @param {string} idCliente - ID do cliente a ser deletado.
   * @returns {Promise<boolean>} Retorna true em caso de sucesso.
   * @throws Retorna erro 500 caso ocorra falha ao deletar o cliente.
   */

  // Deletar o cliente
  deletarCliente: async (idCliente) => {
    try {
      const pool = await getConnection();

      const query = `
        DELETE FROM Clientes
        WHERE idCliente = @idCliente
      `;

      await pool
        .request()
        .input("idCliente", sql.UniqueIdentifier, idCliente)
        .query(query);

      return true;
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  },
};

module.exports = { clienteModel };
