const express = require('express');
const cors = require('cors');
const path = require('path');

const usersRoutes = require('./routes/usersRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const frontRoutes = require('./routes/frontRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas da API
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/goals', goalsRoutes);

// Rotas de frontend (devem vir depois das rotas da API)
app.use('/', frontRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
