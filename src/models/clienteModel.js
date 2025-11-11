const { sql, getConnection } = require("../config/db");

const clienteModel = {

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
  buscarUm: async (idCliente) => {
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
      const pool = await getConnection(); //Cria conexão com o DB
      let querySql = "SELECT * FROM Clientes WHERE emailCliente = @emailCliente"; //faz busca do cpf

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


  inserirCliente: async ( nomeCliente, cpfCliente, foneCliente, emailCliente, enderecoCliente ) => {
    try {
      const pool = await getConnection();

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

atualizarCliente: async (nomeCliente, cpfCliente, foneCliente, emailCliente, enderecoCliente) => {
  try {
    const pool = await getConnection();
    const querySQL = `
      UPDATE clientes
      SET 
        nomeCliente = @nomeCliente,
        foneCliente = @foneCliente,
        emailCliente = @emailCliente,
        enderecoCliente = @enderecoCliente
      WHERE cpfCliente = @cpfCliente
    `;

    await pool
      .request()
      .input("nomeCliente", sql.VarChar(100), nomeCliente)
      .input("cpfCliente", sql.Char(11), cpfCliente)
      .input("foneCliente", sql.Char(12), foneCliente)
      .input("emailCliente", sql.VarChar(50), emailCliente)
      .input("enderecoCliente", sql.VarChar(250), enderecoCliente)
      .query(querySQL);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error; // Passa o erro para o controller tratar
  }
},

  deletarCliente: async (cpfCliente) => {
    try {
      const pool = await getConnection();

      const querySQL = "DELETE FROM clientes WHERE cpfCliente=@cpfCliente;";

      await pool
        .request()
        .input("cpfCliente", sql.Char(11), cpfCliente)
        .query(querySQL);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  },
};

module.exports = { clienteModel };
