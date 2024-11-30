const mysql = require('mysql2');

// Configuração do pool de conexões
const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

// Fazendo o pool funcionar com promises
const promisePool = pool.promise();

// Função para verificar e criar o banco de dados e tabelas
async function verificarECriarEstrutura() {
    try {
        const connection = await promisePool.getConnection();

        // Verificar se o banco de dados existe (use a conexão sem especificar o banco inicialmente)
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`);

        // Selecionar o banco de dados
        await connection.query(`USE ${process.env.MYSQL_DATABASE};`);

        // Criar a tabela `vendas` caso não exista
        await connection.query(`
            CREATE TABLE IF NOT EXISTS vendas (
                id_venda INT AUTO_INCREMENT PRIMARY KEY,
                valor_total DECIMAL(10, 2) NOT NULL,
                data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Criar a tabela `vendas_produtos` caso não exista
        await connection.query(`
            CREATE TABLE IF NOT EXISTS vendas_produtos (
                id_venda INT NOT NULL,
                id_produto INT NOT NULL,
                quantidade INT NOT NULL,
                valor_unitario DECIMAL(10, 2) NOT NULL,
                PRIMARY KEY (id_venda, id_produto),
                FOREIGN KEY (id_venda) REFERENCES vendas(id_venda)
            );
        `);

        console.log('Banco de dados e tabelas verificados/criados com sucesso.');
        connection.release();
    } catch (error) {
        console.error('Erro ao verificar/criar estrutura do banco:', error.message);
        throw error;
    }
}

// Chamar a função ao carregar o módulo
verificarECriarEstrutura();

module.exports = promisePool;
