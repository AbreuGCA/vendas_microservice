// Carregar as variáveis de ambiente do arquivo .env
require('dotenv').config();

const mysql = require('mysql2');

// Criando a conexão com as variáveis de ambiente
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,  // Usando a variável de ambiente para o host
  user: process.env.MYSQL_USER,  // Usando a variável de ambiente para o usuário
  password: process.env.MYSQL_PASSWORD,  // Usando a variável de ambiente para a senha
  database: process.env.MYSQL_DATABASE,  // Usando a variável de ambiente para o banco de dados
  port: process.env.MYSQL_PORT  // Usando a variável de ambiente para a porta
});

// Conectando ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com o ID: ' + connection.threadId);
});

// Testando a conexão com uma query simples
connection.query('SELECT NOW()', (err, results) => {
  if (err) {
    console.error('Erro na consulta: ', err.stack);
  } else {
    console.log('Resultado da consulta: ', results);
  }
  connection.end();  // Fechar a conexão após a consulta
});
