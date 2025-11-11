const express = require("express");
const app = express();
require("dotenv").config();
const {clienteRoutes} = require("./src/routes/clienteRoutes");

const PORT = 8081;

app.use(express.json());

app.use('/', clienteRoutes);

app.listen(PORT, ()=>{
    console.log(`Servidor Rodando em http://localhost:${PORT}`);
})

