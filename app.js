const express = require("express");
require("dotenv").config();
const app = express();
const {pedidoRoutes} = require("./src/routes/pedidoRoutes");
const {clienteRoutes} = require("./src/routes/clienteRoutes");

const PORT = 8081;

app.use(express.json());

app.use('/', pedidoRoutes);
app.use('/', clienteRoutes);

app.listen(PORT, ()=>{
    console.log(`Servidor Rodando em http://localhost:${PORT}`);
})
