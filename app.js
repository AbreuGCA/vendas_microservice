const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./database');
const vendasRoutes = require('./routes/vendasRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Rotas
app.use('/vendas', vendasRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Microserviço de vendas rodando na porta ${PORT}`);
});
