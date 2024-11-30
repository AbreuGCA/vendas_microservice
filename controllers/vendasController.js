const pool = require('../database');
const estoqueService = require('../services/estoqueService');

const vendasController = {
    realizarVenda: async (req, res) => {
        const { produtos } = req.body; // [{ idProduto, quantidade }]

        const connection = await pool.getConnection();

        try {
            // Validações e cálculo do valor total
            let valorTotal = 0;

            for (const produto of produtos) {
                // Busca detalhes do produto no microserviço de estoque
                const produtoEstoque = await estoqueService.verificarProduto(produto.idProduto);

                if (!produtoEstoque) {
                    return res.status(404).json({ 
                        message: `Produto com ID ${produto.idProduto} não encontrado no estoque.` 
                    });
                }

                if (produtoEstoque.quantidade < produto.quantidade) {
                    return res.status(400).json({ 
                        message: `Estoque insuficiente para o produto: ${produtoEstoque.nome}` 
                    });
                }

                // Calcula o valor total da venda
                valorTotal += produto.quantidade * produtoEstoque.valorUnitario;
            }

            // Inicia a transação
            await connection.beginTransaction();

            // Insere a venda
            const [result] = await connection.query(
                'INSERT INTO vendas (valor_total) VALUES (?)',
                [valorTotal]
            );
            const idVenda = result.insertId;

            // Insere os produtos vendidos
            for (const produto of produtos) {
                const produtoEstoque = await estoqueService.verificarProduto(produto.idProduto);
                await connection.query(
                    'INSERT INTO vendas_produtos (id_venda, id_produto, quantidade, valor_unitario) VALUES (?, ?, ?, ?)',
                    [idVenda, produto.idProduto, produto.quantidade, produtoEstoque.valorUnitario]
                );
            }

            // Atualiza o estoque no microserviço de estoque
            await estoqueService.atualizarEstoque(produtos);

            // Confirma a transação
            await connection.commit();

            res.status(201).json({ message: 'Venda realizada com sucesso!', idVenda });
        } catch (error) {
            // Reverte a transação em caso de erro
            await connection.rollback();
            res.status(500).json({ message: error.message });
        } finally {
            connection.release();
        }
    },

    listarVendas: async (req, res) => {
        try {
            // Busca todas as vendas do banco
            const [vendas] = await pool.query('SELECT * FROM vendas');

            // Opcional: Detalhar produtos vendidos por venda
            const [produtosPorVenda] = await pool.query(
                `SELECT vp.id_venda, vp.id_produto, vp.quantidade, vp.valor_unitario 
                 FROM vendas_produtos vp`
            );

            // Mapeia os produtos para suas respectivas vendas
            const vendasDetalhadas = vendas.map(venda => ({
                ...venda,
                produtos: produtosPorVenda.filter(p => p.id_venda === venda.id_venda)
            }));

            res.status(200).json({ vendas: vendasDetalhadas });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = vendasController;
