const express = require('express');
const router = express.Router();
const path = require('path');

// Roteamento para páginas dinâmicas
router.get('/', (req, res) => {
  res.render('layout/main', {
    pageTitle: 'MoneyMap - Dashboard',
    activeTab: 'dashboard',
    content: 'dashboard'
  });
});

router.get('/transactions', (req, res) => {
  res.render('layout/main', {
    pageTitle: 'MoneyMap - Transações',
    activeTab: 'transactions',
    content: 'dashboard'
  });
});

router.get('/categories', (req, res) => {
  res.render('layout/main', {
    pageTitle: 'MoneyMap - Categorias',
    activeTab: 'categories',
    content: 'dashboard'
  });
});

router.get('/goals', (req, res) => {
  res.render('layout/main', {
    pageTitle: 'MoneyMap - Metas',
    activeTab: 'goals',
    content: 'dashboard'
  });
});


module.exports = router;
