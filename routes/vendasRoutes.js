const express = require('express');
const vendasController = require('../controllers/vendasController');

const router = express.Router();

// Rota para realizar venda
router.post('/', vendasController.realizarVenda);

// Rota para listar todas as vendas
router.get('/', vendasController.listarVendas);

module.exports = router;
