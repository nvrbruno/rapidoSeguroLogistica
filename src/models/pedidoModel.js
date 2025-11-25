const { sql, getConnection } = require("../config/db");

const pedidoModel = {
  /**
   * Busca todos os pedidos e seus respectivos itens no banco de dados.
   * @async
   * @function buscarTodos
   * @returns {Promise<Array>} Retorna uma lista com todos os pedidos e seus itens.
   * @throws Mostra no console o error e propaga caso a busca falhe.
   */
  buscarTodos: async () => { // Busca todos os pedidos
    try {
      const pool = await getConnection();

      const querySQL = `
                
    SELECT * FROM Pedidos 
 `; // Consulta no SQL para buscar todos os pedidos 

      const result = await pool.request().query(querySQL); 

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar pedidos", error); // Caso houver erro ao buscar retorna ao usuário 
      throw error;
    }
  },

  buscarUm: async (idPedido) => { //Busca um pedido através do id
    try {
      const pool = await getConnection();

      const querySQL = "SELECT * FROM Pedidos WHERE idPedido = @idPedido"; // Consulta no SQL para buscar apenas um pedido atráves do id
      const result = await pool
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido) //Associa a variável "idPedido"
        .query(querySQL);

      return result.recordset;
    } catch (error) {
      console.error("erro ao buscar o pedido:", error); // Caso houver erro ao buscar um pedido através do id, retorna ao usuário
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
  ) => { // Inseri um novo pedido 
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
    `; // Insere dentro do banco de dados e retorna o id do pedido

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
        .query(querySQL);// Executa a consulta no SQL

      const idPedido = result.recordset[0].idPedido;

      const querySQLEntregas = `
      INSERT INTO Entregas (idEntrega, idPedido, valorDistancia, valorPeso, acrescEntrega, descEntrega, taxaExtra, valorFinal)
      VALUES(@idEntrega, @idPedido, @valorDistancia, @valorPeso, @acrescEntrega, @descEntrega, @taxaExtra, @valorFinal )
    `; // Insere os dados de entrega 

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
        .query(querySQLEntregas); // Executa a consulta no SQL
         
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error("Erro ao inserir pedido:", error); // Caso haja algum erro ao inserir, retorna ao cliente
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
  ) => { // Atualiza as informações do pedido antigo
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
      `;
      // Atualiza os dados de pedido
      const querySQLEntregas = `      
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
      // Atualiza os dados de entrega
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
      // Atualiza os dados do pedido
      await transaction
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .input("valorDistancia", sql.Decimal(10, 2), valorDistanciaAtualizado)
        .input("valorPeso", sql.Decimal(10, 2), valorPesoAtualizado)
        .input("acrescEntrega", sql.Decimal(10, 2), acrescEntregaAtualizado)
        .input("descEntrega", sql.Decimal(10, 2), descEntregaAtualizado)
        .input("taxaExtra", sql.Decimal(10, 2), taxaExtraAtualizado)
        .input("valorFinal", sql.Decimal(10, 2), valorFinalAtualizado) // Atualiza os dados de entrega
        .query(querySQLEntregas);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      throw error;
    }
  },

  // Atualiza o status do pedido e da entrega
  statusPedido: async (idPedido, statusPedido, statusEntrega) => {
    try {
      const pool = await getConnection();
      // Utiliza o SQL para atualizar o status de pedidos e o status de entregas
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
        .input("statusPedido", sql.VarChar(11), statusPedido) // Passa o novo status de pedido
        .input("statusEntrega", sql.VarChar(11), statusEntrega) // Passa o novo status de entrega
        .query(querySQL);
    } catch (error) {
      console.error("Erro ao atualizar o pedido:", error); // Caso haja erro ao atualizar, retorna ao usuário
      throw error;
    }
  },
  buscarEntrega: async (idPedido) => {
    try {
      const pool = await getConnection();

      const querySQL = "SELECT * FROM Entregas WHERE idPedido = @idPedido;"; // Consulta no SQL para buscar a entrega

      const result = await pool
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(querySQL);

      return result.recordset;
    } catch (error) {
      console.error("Erro ao buscar entregas", error); // Caso haja algum erro ao buscar as entregas, retorna ao cliente
      throw error;
    }
  },

  deletarPedido: async (idPedido) => {
    try {
      const pool = await getConnection();
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      const querySQL = `
      DELETE FROM Pedidos
      WHERE idPedido = @idPedido
      `; // Consulta no SQL para deletar o pedido 
      const querySQLEntregas = `      
      DELETE FROM Entregas
      WHERE idPedido = @idPedido
    `;

       // Executa a primeira consulta com o parâmetro 'idPedido'
      await transaction
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(querySQLEntregas);

      // Executa a primeira consulta com o parâmetro 'idPedido'
      await transaction
        .request()
        .input("idPedido", sql.UniqueIdentifier, idPedido)
        .query(querySQL);

      transaction.commit(); //Confirma a transição se as duas consultas forem bem sucedidas

    } catch (error) {
      transaction.rollback();
      console.error("Erro ao deletar o pedido:", error); // Caso haja erro, é relatado ao cliente
      throw error;
    }
  },
};
module.exports = { pedidoModel };
