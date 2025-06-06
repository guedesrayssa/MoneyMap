// Configuração base da API
const API_BASE_URL = 'http://localhost:3000/api';

// Objeto para gerenciar as chamadas à API
const api = {
    // Transações
    async getTransactions() {
        const response = await fetch(`${API_BASE_URL}/transactions`);
        if (!response.ok) throw new Error('Erro ao buscar transações');
        return response.json();
    },

    async createTransaction(data) {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao criar transação');
        return response.json();
    },

    async updateTransaction(id, data) {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao atualizar transação');
        return response.json();
    },

    async deleteTransaction(id) {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao deletar transação');
        return response.json();
    },

    // Categorias
    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Erro ao buscar categorias');
        return response.json();
    },

    async createCategory(data) {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao criar categoria');
        return response.json();
    },

    async updateCategory(id, data) {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao atualizar categoria');
        return response.json();
    },

    async deleteCategory(id) {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao deletar categoria');
        return response.json();
    },

    // Metas
    async getGoals() {
        const response = await fetch(`${API_BASE_URL}/goals`);
        if (!response.ok) throw new Error('Erro ao buscar metas');
        return response.json();
    },

    async createGoal(data) {
        const response = await fetch(`${API_BASE_URL}/goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao criar meta');
        return response.json();
    },

    async updateGoal(id, data) {
        const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao atualizar meta');
        return response.json();
    }
};
