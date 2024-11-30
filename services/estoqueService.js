const axios = require('axios');

// URL do microserviço de estoque
const estoqueServiceUrl = process.env.ESTOQUE_SERVICE_URL;

// Serviço para comunicação com o estoque
const estoqueService = {
    atualizarEstoque: async (produtos) => {
        try {
            const response = await axios.post(`${estoqueServiceUrl}/estoque/vendeu`, produtos);
            return response.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Erro ao comunicar com o serviço de estoque');
        }
    },
    verificarProduto: async (idProduto) => {
        try {
            const response = await axios.get(`${estoqueServiceUrl}/estoque/${idProduto}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data : 'Produto não encontrado no estoque');
        }
    }
};

module.exports = estoqueService;
