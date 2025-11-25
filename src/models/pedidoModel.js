const { sql, getConnection } = require("../config/db");

const pedidoModel = {
  /**
   * Busca todos os pedidos e seus respectivos itens no banco de dados.
   * @async
   * @function buscarTodos
   * @returns {Promise<Array>} Retorna uma lista com todos os pedidos e seus itens.
   * @throws Mostra no console o error e propaga caso a busca falhe.
   */
  buscarTodos: async () => {
    try {
      const pool = await getConnection();

      const querySQL = `
                
SELECT * FROM Pedidos
 `;

      const result = await pool.request().query(querySQL);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar pedidos", error);
      throw error;
    }
  },

  buscarUm: async (idPedido) => {
    try {
      const pool = await getConnection();

      const querySQL = "SELECT * FROM Pedidos WHERE idPedido = @idPedido";
      const result = await pool
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(querySQL);

      return result.recordset;
    } catch (error) {
      console.error("erro ao buscar o pedido:", error);
      throw error;
    }
  },

inserirPedido: async (
  idCliente,
  dataPedido,
  tipoPedido,
  distanciaPedido,
  pesoPedido,
  valorBaseKm,
  valorBaseKg,
  valorTotal,
  valorDistancia,
  valorPeso,
  acrescEntrega,
  descEntrega,
  taxaExtra
) => {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const querySQL = `
      INSERT INTO Pedidos (
        idCliente,
        dataPedido,
        tipoPedido,
        distanciaPedido,
        pesoPedido,
        valorBaseKm,
        valorBaseKg,
        valorTotal
      )
        OUTPUT INSERTED.idPedido
      VALUES (
        @idCliente,
        @dataPedido,
        @tipoPedido,
        @distanciaPedido,
        @pesoPedido,
        @valorBaseKm,
        @valorBaseKg,
        @valorTotal
      )
    `;

    const result = await transaction
      .request()
      .input("idCliente", sql.UniqueIdentifier, idCliente)
      .input("dataPedido", sql.Date, dataPedido)
      .input("tipoPedido", sql.VarChar(7), tipoPedido)
      .input("distanciaPedido", sql.Decimal(10, 2), distanciaPedido)
      .input("pesoPedido", sql.Decimal(10, 2), pesoPedido)
      .input("valorBaseKm", sql.Decimal(10, 2), valorBaseKm)
      .input("valorBaseKg", sql.Decimal(10, 2), valorBaseKg)
      .input("valorTotal", sql.Decimal(10, 2), valorTotal)
      .query(querySQL);

    const idPedido = result.recordset[0].idPedido;

    const querySQLEntregas = `
      INSERT INTO Entregas (idEntrega, idPedido, valorDistancia, valorPeso, acrescEntrega, descEntrega, taxaExtra, valorFinal)
      VALUES(@idEntrega, @idPedido, @valorDistancia, @valorPeso, @acrescEntrega, @descEntrega, @taxaExtra, @valorFinal )
    `;

    await transaction
      .request()
      .input("idEntrega", sql.UniqueIdentifier, idCliente)
      .input("idPedido", sql.UniqueIdentifier, idPedido)
      .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
      .input("valorPeso", sql.Decimal(10, 2), valorPeso)
      .input("acrescEntrega", sql.Decimal(10, 2), acrescEntrega)
      .input("descEntrega", sql.Decimal(10, 2), descEntrega)
      .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
      .input("valorFinal", sql.Decimal(10, 2), valorTotal)
      .query(querySQLEntregas);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Erro ao inserir pedido:", error);
    throw new Error("Erro ao inserir pedido no banco de dados.");
  }
},


atualizarPedido: async (
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
) => {
    const pool = await getConnection();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  try {

    const querySQL = `
      UPDATE Pedidos
      SET idCliente = @idCliente,
          dataPedido = @dataPedido,
          tipoPedido = @tipoPedido,
          distanciaPedido = @distanciaPedido,
          pesoPedido = @pesoPedido,
          valorBaseKm = @valorBaseKm,
          valorBaseKg = @valorBaseKg,
          valorTotal = @valorTotal
      WHERE idPedido = @idPedido
      `
    const querySQLEntregas =`      
          UPDATE Entregas
          SET
          valorDistancia  = @valorDistancia,
          valorPeso = @valorPeso,
          acrescEntrega  = @acrescEntrega,
          descEntrega  = @descEntrega,
          taxaExtra  = @taxaExtra,
          valorFinal = @valorFinal
      WHERE idPedido = @idPedido
    `;

    await transaction
      .request()
      .input("idPedido", sql.UniqueIdentifier, idPedido)
      .input("idCliente", sql.UniqueIdentifier, idClienteAtualizado)
      .input("dataPedido", sql.Date, dataPedidoAtualizado)
      .input("tipoPedido", sql.VarChar(20), tipoPedidoAtualizado)
      .input("distanciaPedido", sql.Decimal(10, 2), distanciaPedidoAtualizado)
      .input("pesoPedido", sql.Decimal(10, 2), pesoPedidoAtualizado)
      .input("valorBaseKm", sql.Decimal(10, 2), valorBaseKmAtualizado)
      .input("valorBaseKg", sql.Decimal(10, 2), valorBaseKgAtualizado)
      .input("valorTotal", sql.Decimal(10, 2), valorFinalAtualizado)
      .query(querySQL);

    await transaction
      .request()
      .input("idPedido", sql.UniqueIdentifier, idPedido)
      .input("valorDistancia", sql.Decimal(10, 2), valorDistanciaAtualizado)
      .input("valorPeso", sql.Decimal(10, 2), valorPesoAtualizado)
      .input("acrescEntrega", sql.Decimal(10, 2), acrescEntregaAtualizado)
      .input("descEntrega", sql.Decimal(10, 2), descEntregaAtualizado)
      .input("taxaExtra", sql.Decimal(10, 2), taxaExtraAtualizado)
      .input("valorFinal", sql.Decimal(10, 2), valorFinalAtualizado)
      .query(querySQLEntregas);

  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    throw error;
  }
},


  
statusPedido: async (idPedido, statusPedido, statusEntrega) => {
  try {
    const pool = await getConnection();
    const querySQL = `
      UPDATE Entregas
      SET statusEntrega = @statusEntrega
      WHERE idPedido = @idPedido;

      UPDATE Pedidos
      SET statusPedido = @statusPedido
      WHERE idPedido = @idPedido;
    `;

    await pool
      .request()
      .input("idPedido", sql.UniqueIdentifier, idPedido)
      .input("statusPedido", sql.VarChar(11), statusPedido)
      .input("statusEntrega", sql.VarChar(11), statusEntrega)
      .query(querySQL);

  } catch (error) {
    console.error("Erro ao atualizar o pedido:", error);
    throw error;
  }
},

};
module.exports = { pedidoModel };
