const fs = require('fs');
const { Client } = require('pg');

// Configuração do banco
const client = new Client({
  user: '',
  host: 'localhost',
  database: 'seu_banco',
  password: 'sua_senha',
  port: 5432, // padrão do PostgreSQL
});

async function runScript() {
  try {
    await client.connect();

    const sql = fs.readFileSync('./script.sql', 'utf8');
    await client.query(sql);

    console.log('Script SQL executado com sucesso!');
  } catch (error) {
    console.error('Erro ao executar o script SQL:', error);
  } finally {
    await client.end();
  }
}

runScript();
