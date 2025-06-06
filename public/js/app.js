// Estado da aplicação
const app = {
    categories: [],
    transactions: [],
    budgets: [],
    savingsGoal: 0,
    currentPage: 'dashboard',
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    editingTransaction: null,
    editingCategory: null,
    confirmCallback: null,
    charts: {}
};

// Função para carregar dados da API
async function loadData() {
    try {
        // Carregar categorias
        app.categories = await api.getCategories();

        // Criar categorias padrão se não existirem
        if (app.categories.length === 0) {
            const defaultCategories = [
                { name: 'Salário', type: 'income', color: '#2ECC71', icon: 'fa-money-bill-wave' },
                { name: 'Freelance', type: 'income', color: '#3585DB', icon: 'fa-laptop' },
                { name: 'Alimentação', type: 'expense', color: '#31629D', icon: 'fa-utensils' },
                { name: 'Transporte', type: 'expense', color: '#2D8561', icon: 'fa-car' },
                { name: 'Moradia', type: 'expense', color: '#2C3E50', icon: 'fa-home' },
                { name: 'Lazer', type: 'expense', color: '#C1F8B6', icon: 'fa-gamepad' }
            ];

            for (const category of defaultCategories) {
                await api.createCategory(category);
            }
            app.categories = await api.getCategories();
        }

        // Carregar transações
        app.transactions = await api.getTransactions();

        // Carregar metas
        app.goals = await api.getGoals();

        // Atualizar interface
        updateUI();
    } catch (error) {
        showNotification('Erro ao carregar dados: ' + error.message, 'error');
    }
}

// Funções para salvar dados através da API
async function saveCategory(category) {
    try {
        if (category.id) {
            await api.updateCategory(category.id, category);
        } else {
            await api.createCategory(category);
        }
        await loadData();
    } catch (error) {
        showNotification('Erro ao salvar categoria: ' + error.message, 'error');
    }
}

async function saveTransaction(transaction) {
    try {
        if (transaction.id) {
            await api.updateTransaction(transaction.id, transaction);
        } else {
            await api.createTransaction(transaction);
        }
        await loadData();
    } catch (error) {
        showNotification('Erro ao salvar transação: ' + error.message, 'error');
    }
}

// ... rest of your JavaScript functions ...

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    setupEvents();
    loadData();
    navigateTo('dashboard');
});
