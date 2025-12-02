<!--API Clientes-->
## API Clientes

### MODELO ENTIDADE RELACIONAMENTO
![MODELO ENTIDADE RELACIONAMENTO](./Rapido%20&%20Seguro%20Logistica.png)

### GET/clientes
**Descrição**: Mostra todos os clientes


**Response**: Array clientes

#### POST/Clientes
- **Descrição**: Gera um novo cliente
- **Body**: 
{
    "nomeCliente": "Danielly Rodrigues",
    "cpfCliente": "12345689123",
      "foneCliente": "123456789123",
      "emailCliente": "danizinha123@gmail.com",
    "enderecoCliente": "Rua Salerno, 128, Favela Salerno, Sumaré - SP, 13175-480"
}
- **Response**: 
{
    "message": "Cliente cadastrado com sucesso!"
}

- **Error Response**

{
    "error": "Erro ao inserir clientes"
}


#### PUT/Clientes/:idCliente
- **Descrição**: Edita os dados do cliente
- **Body**:
{
    "nomeCliente": "Danielly Rodrigues",
    "cpfCliente": "12345678909",
    "foneCliente": "123456789123",
    "emailCliente": "danizinha123@gmail.com",
    "enderecoCliente": "Rua Salerno, 128, Favela Salerno, Sumaré - SP, 13175-480"
}

- **Response**:
{
    "message": "Cliente atualizado com sucesso!"
}

- **Error Response**:

{
    "erro": "Erro ao atualizar cliente:"
}

#### DELETE /clientes/:idCliente
- **Descrição**: Exclui um cliente
- **Response**:
{
    "message": "Cliente excluído com sucesso!"
}

- **Error Response**:

{
     "erro": "Não é possível deletar o cliente, pois ele possui pedidos vinculados."
}


<!--API Pedidos-->

## API Pedidos

### Pedidos

#### GET/pedidos
- **Descrição**: Mostra todos os pedidos
- **Response**: Array de pedidos

#### POST/pedidos
- **Descrição**: Gera um novo pedido
- **Body**: 
{
  "idCliente": "92F2DDB1-C763-4711-9ACE-54C331DB4826",
  "cpfCliente": "12345689123",
  "dataPedido": "2025-11-11",
  "tipoPedido": "urgente",
  "distanciaPedido": 3.10,
  "pesoPedido": 42.30,
  "valorBaseKm": 5.00,
  "valorBaseKg": 7.00
}
- **Response**: 
{
    "message": "Pedido cadastrado com sucesso!"
}

- **Error Response**:

{
    "erro": "Cliente não encontrado!"
}

- **Error Response**:

{
    "erro": "Campos obrigatórios não preeenchidos !"
}


- **Error Response**:

{
    "erro": "Esse CPF já está cadastrado"
}

- **Error Response**:

{
    "erro": "Esse EMAIL já está cadastrado"
}



#### PUT/pedidos
- **Descrição**: Edita os dados do pedido
- **Body**:
{
  "idCliente": "92F2DDB1-C763-4711-9ACE-54C331DB4826",
  "cpfCliente": "12345689123",
  "dataPedido": "2025-11-11",
  "tipoPedido": "normal",
  "distanciaPedido": 3.10,
  "pesoPedido": 42.30,
  "valorBaseKm": 5.00,
  "valorBaseKg": 7.00
}
- **Response**:
{
    "message": "Pedido atualizado com sucesso!"
}

- **Error Response**:
{
    "error": "ID inválido"
}

- **Error Response**:
{
    "erro": "Cliente não encontrado!"
}



<!--API Entregas-->

## API Entregas

### Entregas

#### GET/entregas
- **Descrição**: Mostra todos as entregas
- **Response**: Array de entregas

- **Response**:
[
	{
		"idEntrega": "32CA8696-F044-4568-B617-DAAF9BB0C887",
		"idPedido": "EDCE1DBB-83DE-43E7-B0E4-F1FA93B60957",
		"valorDistancia": 100,
		"valorPeso": 100,
		"acrescEntrega": 0,
		"descEntrega": 0,
		"taxaExtra": 0,
		"valorFinal": 200,
		"statusEntrega": "ENTREGUE"
	}
]

- **Error Response**:
{
    "erro": "ID da entrega inválido!"
}

- **Error Response**:
{
    "erro": "Entrega não encontrada."
}

-
##### PUT/entregas/statusentrega
- **Descrição**: Edita o status da entrega
- **Body**:
{
    "statusPedido":"EM TRANSITO"
}
- **Response**:
{
    "message": "Entrega atualizado com sucesso."
}

- **Error Response**
{
    "erro": "statusEntrega é obrigatório."
}

**Error Response**:
{
    "erro": "Entrega não encontrada."
}

**Error Response**:
{
    "erro": "Erro ao atualizar status da entrega."
}
