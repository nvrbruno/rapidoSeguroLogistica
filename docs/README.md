<!--API Clientes-->
## API Clientes

### MODELO ENTIDADE RELACIONAMENTO
![MODELO ENTIDADE RELACIONAMENTO](./Rapido%20&%20Seguro%20Logistica.png)

### GET/clientes
-**Descrição**: Mostra todos os clientes

-**Response**: Array clientes

#### POST/Clientes
-**Descrição**: Gera um novo cliente
-**Body**: 
```
{
    "nomeCliente": "Danielly Rodrigues",
    "cpfCliente": "12345689123",
	  "foneCliente": "123456789123",
	  "emailCliente": "danizinha123@gmail.com",
  	"enderecoCliente": "Rua Salerno, 128, Favela Salerno, Sumaré - SP, 13175-480"
}
```
-**Response**: 
```
{
    "message": "Cliente cadastrado com sucesso!"
}
```

#### PUT/Clientes
-**Descrição**: Edita os dados do cliente
-**Body**:
```
{
    "nomeCliente": "Danielly Rodrigues",
    "foneCliente": "123456789123",
    "emailCliente": "danizinha123@gmail.com",
    "enderecoCliente": "Rua Salerno, 128, Favela Salerno, Sumaré - SP, 13175-480"
}

```
-**Response**:
```
{
    "message": "Cliente atualizado com sucesso!"
}
```


#### DELETE/clientes
-**Descrição**: Exclui um cliente
-**Response**:
```
{
    "message": "Cliente excluído com sucesso!"
}
```

<!--API Pedidos-->

## API Pedidos

### Pedidos

#### GET/pedidos
-**Descrição**: Mostra todos os pedidos
-**Response**: Array de pedidos

#### POST/pedidos
-**Descrição**: Gera um novo pedido
-**Body**: 
```
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
```
-**Response**: 
```
{
    "message": "Pedido cadastrado com sucesso!"
}
```

#### PUT/pedidos
-**Descrição**: Edita os dados do pedido
-**Body**:
```
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
```
-**Response**:
```
{
    "message": "Pedido atualizado com sucesso!"
}
```
##### PUT/pedidos
-**Descrição**: Edita o status do pedido
-**Body**:
```
{
	"statusPedido":"EM TRANSITO"
}
```
-**Response**:
```
{
	"message": "Pedido atualizado com sucesso."
}
```

###### DELETE/pedidos
-**Descrição**: Exclui um pedido
-**Response**:
```
{
    "message": "Pedido excluído com sucesso!"
}
```

