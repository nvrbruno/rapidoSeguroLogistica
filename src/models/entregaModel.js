const { sql, getConnection } = require("../config/db");
const entregaModel = {
  buscarEntrega: async (idPedido) => {
    try {
      const pool = await getConnection();

      const querySQL = `   
    SELECT * FROM Entregas
    WHERE idPedido = @idPedido
     `;

      const result = await pool.request()
      .input("idPedido", sql.UniqueIdentifier, idPedido)
      .query(querySQL);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar entregas", error);
      throw error;
    }
  },
};
module.exports = { entregaModel };
