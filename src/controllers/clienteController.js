const { clienteModel } = require("../models/clienteModel");

const clienteController = {
  //---------------------------
  //LISTAR TODOS OS CLIENTES
  //GET /CLIENTES
  //---------------------------

  listarClientes: async (req, res) => {
 try {
      const {idCliente} = req.query;

      if (idCliente) {
        if(idCliente.length != 36) {
          return res.status(400).json({erro: `id do cliente invalido!`})
        }
        const cliente = await clienteModel.buscarUm(idCliente);

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

  criarCliente: async (req, res) => { 
    try {
      const { nomeCliente, cpfCliente, foneCliente, emailCliente, enderecoCliente } = req.body;
      if (
        nomeCliente === undefined ||
        cpfCliente == undefined || foneCliente == undefined || emailCliente == undefined || enderecoCliente == undefined
      ) {
        return res
          .status(400)
          .json({ erro: "Campos obrigatorios não preenchidos" });
      }
      const clientes = await clienteModel.buscarCPF(cpfCliente)

      if (clientes.length > 0) { //condição para procurar se o cpf ja está cadastrado no banco de dados
        return res.status(409).json({ erro: "Esse cpf já esta cadastrado" });
      }

      await clienteModel.inserirCliente(nomeCliente, cpfCliente, foneCliente, emailCliente, enderecoCliente);

      res.status(201).json({ message: "cliente cadastrado com sucesso!" });
    } catch (error) {
      
      console.error('Erro ao cadastrar o cliente:',error);
      res.status(500).json({erro: 'Erro no servidor ao cadastrar cliente!'})
    }
  },
  
atualizarCliente: async (req, res) => {
  try {
    const { cpfCliente } = req.params; 
    const { nomeCliente, foneCliente, emailCliente, enderecoCliente } = req.body;


    if (!cpfCliente || cpfCliente.length !== 11) {
      return res.status(400).json({ erro: "CPF inválido!" });
    }

    const cliente = await clienteModel.buscarCPF(cpfCliente);

    if (!cliente || cliente.length === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado!" });
    }

    const clienteAtual = cliente[0];

    const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente;
    const cpfAtualizado = cpfCliente; 
    const foneAtualizado = foneCliente ?? clienteAtual.foneCliente;
    const emailAtualizado = emailCliente ?? clienteAtual.emailCliente;
    const enderecoAtualizado = enderecoCliente ?? clienteAtual.enderecoCliente;

    await clienteModel.atualizarCliente(
      nomeAtualizado,
      cpfAtualizado,
      foneAtualizado,
      emailAtualizado,
      enderecoAtualizado
    );

    return res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro no servidor ao atualizar cliente." });
  }
},

  


  deletarCliente: async (req, res) => {
    try {
      const { cpfCliente } = req.params;

    if (!cpfCliente || cpfCliente.length !== 11) {
      return res.status(400).json({ erro: "CPF inválido!" });
    }
      

    const cliente = await clienteModel.buscarCPF(cpfCliente);

    if (!cliente || cliente.length === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado!" });
    }
      console.log(cpfCliente);

      await clienteModel.deletarCliente(cpfCliente);
      res.status(200).json({ message: "Cliente excluído com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro no servidor ao excluir o cliente." });
    }
  },
};

module.exports = { clienteController }; 