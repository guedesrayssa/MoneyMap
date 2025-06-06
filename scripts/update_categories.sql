-- Adicionar colunas color e icon na tabela categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS color VARCHAR(50),
ADD COLUMN IF NOT EXISTS icon VARCHAR(50);

-- Atualizar o check constraint do tipo para aceitar valores em inglês
ALTER TABLE categories 
DROP CONSTRAINT IF EXISTS categories_type_check,
ADD CONSTRAINT categories_type_check 
CHECK (type IN ('receita', 'despesa', 'income', 'expense'));
