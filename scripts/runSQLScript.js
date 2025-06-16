
const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.tvlepsgoohnfnrsnpooj',
  password: 'nhSBu2ZM3?!@EY2',
  database: 'postgres',
});

const sql = `
-- Habilita a extensão para suporte a UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--  Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  Tabela de Categorias (personalizáveis)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('receita', 'despesa'))
);

--  Tabela de Transações
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  Tabela de Metas por categoria/mês
CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL,
    UNIQUE(user_id, category_id, month)
);

--  Tabela de Alertas
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

(async () => {
  try {
    await client.connect();
    await client.query(sql);
    console.log('📦 Script SQL executado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao executar o script SQL:', err.message);
  } finally {
    await client.end();
  }
})();
