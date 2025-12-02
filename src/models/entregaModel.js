const { sql, getConnection } = require("../config/db");

const entregaModel = {
  /**
   * Atualiza apenas o status de uma entrega específica.
   *
   * @async
   * @function atualizarSomenteEntrega
   * @param {string} idEntrega - ID da entrega a ser atualizada (UUID).
   * @param {string} statusEntrega - Novo status da entrega.
   * @returns {Promise<void>} Retorna verdadeiro em caso de sucesso.
   * @throws Retorna erro 500 caso ocorra falha ao atualizar o status da entrega.
   */

  atualizarSomenteEntrega: async (idEntrega, statusEntrega) => {
    try {
      const pool = await getConnection();

      const querySQL = `
      UPDATE Entregas
      SET statusEntrega = @statusEntrega
      WHERE idEntrega = @idEntrega;
    `;

      await pool
        .request()
        .input("idEntrega", sql.UniqueIdentifier, idEntrega)
        .input("statusEntrega", sql.VarChar(20), statusEntrega)
        .query(querySQL);
    } catch (error) {
      console.error("Erro ao atualizar status da entrega:", error);
      throw error;
    }
  },

  /**
   * Busca todas as entregas cadastradas no banco de dados.
   *
   * @async
   * @function buscarTodos
   * @returns {Promise<Array>} Retorna um array com todas as entregas.
   * @throws Retorna erro 500 caso ocorra falha ao buscar as entregas.
   */

  // Busca todas as entregas
  buscarTodos: async () => {
    try {
      const pool = await getConnection();
      const querySQL = "SELECT * FROM Entregas";

      const result = await pool.request().query(querySQL);
      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar entregas:", error);
      throw error;
    }
  },

  /**
   * Busca uma entrega específica pelo seu ID.
   *
   * @async
   * @function buscarUmPorIdEntrega
   * @param {string} idEntrega - ID da entrega a ser buscada (UUID).
   * @returns {Promise<Array>} Retorna um array com os dados da entrega encontrada.
   * @throws Retorna erro 500 caso ocorra falha ao buscar a entrega.
   */

  // Busca uma entrega específica
  buscarUmPorIdEntrega: async (idEntrega) => {
    try {
      const pool = await getConnection();

      const querySQL = `
        SELECT * 
        FROM Entregas
        WHERE idEntrega = @idEntrega
      `;

      const result = await pool
        .request()
        .input("idEntrega", sql.UniqueIdentifier, idEntrega)
        .query(querySQL);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar entrega:", error);
      throw error;
    }
  },
};

module.exports = { entregaModel };
