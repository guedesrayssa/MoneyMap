// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", function () {
    // Estado da aplicação
    const app = {
        categories: [],
        transactions: [],
        budgets: [],
        savingsGoal: 0,
        currentPage: "dashboard",
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        editingTransaction: null,
        editingCategory: null,
        confirmCallback: null,
        charts: {},
    };

    // Função para gerar IDs únicos
    function generateId() {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    // Função helper para determinar o tipo da transação
    function getTransactionType(transaction) {
        // Lógica baseada no valor: positivo = receita, negativo = despesa
        return transaction.amount >= 0 ? 'income' : 'expense';
    }

    // Função para mostrar notificações
    function showNotification(message, type = "info") {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }

    // Função para formatar moeda
    function formatCurrency(amount) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(amount);
    }

    // Função para carregar dados da API
    async function loadData() {
        try {
            // Carregar categorias
            app.categories = await api.getCategories();

            // Criar categorias padrão se não existirem
            if (app.categories.length === 0) {
                const defaultCategories = [
                    {
                        name: "Salário",
                        type: "income",
                        color: "#2ECC71",
                        icon: "fa-money-bill-wave",
                    },
                    {
                        name: "Freelance",
                        type: "income",
                        color: "#3585DB",
                        icon: "fa-laptop",
                    },
                    {
                        name: "Alimentação",
                        type: "expense",
                        color: "#31629D",
                        icon: "fa-utensils",
                    },
                    {
                        name: "Transporte",
                        type: "expense",
                        color: "#2D8561",
                        icon: "fa-car",
                    },
                    {
                        name: "Moradia",
                        type: "expense",
                        color: "#2C3E50",
                        icon: "fa-home",
                    },
                    {
                        name: "Lazer",
                        type: "expense",
                        color: "#C1F8B6",
                        icon: "fa-gamepad",
                    },
                ];

                for (const category of defaultCategories) {
                    try {
                        await api.createCategory(category);
                    } catch (error) {
                        console.error("Erro ao criar categoria padrão:", error);
                    }
                }
                app.categories = await api.getCategories();
            }

            // Carregar transações
            try {
                app.transactions = await api.getTransactions();
            } catch (error) {
                console.error("Erro ao carregar transações:", error);
                app.transactions = [];
            }

            // Carregar orçamentos
            try {
                app.budgets = await api.getBudgets();
            } catch (error) {
                console.error("Erro ao carregar orçamentos:", error);
                app.budgets = [];
            }

            // Carregar meta de economia
            try {
                const goals = await api.getGoals();
                app.savingsGoal = goals.length > 0 ? goals[0].amount : 0;
            } catch (error) {
                console.error("Erro ao carregar meta de economia:", error);
                app.savingsGoal = 0;
            }

            updateUI();
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            showNotification(
                "Erro ao carregar dados. Por favor, tente novamente.",
                "error"
            );
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
            await loadData(); // Recarrega os dados
        } catch (error) {
            showNotification(
                "Erro ao salvar categoria: " + error.message,
                "error"
            );
        }
    }

    async function saveTransaction(transaction) {
        try {
            if (transaction.id) {
                await api.updateTransaction(transaction.id, transaction);
            } else {
                await api.createTransaction(transaction);
            }
            await loadData(); // Recarrega os dados
        } catch (error) {
            showNotification(
                "Erro ao salvar transação: " + error.message,
                "error"
            );
        }
    }

    async function saveGoal(goal) {
        try {
            if (goal.id) {
                await api.updateGoal(goal.id, goal);
            } else {
                await api.createGoal(goal);
            }
            await loadData(); // Recarrega os dados
        } catch (error) {
            showNotification("Erro ao salvar meta: " + error.message, "error");
        }
    }

    // Função para navegar entre páginas
    function navigateTo(page) {
        // Atualizar menu
        document.querySelectorAll(".menu li").forEach((item) => {
            item.classList.remove("active");
        });
        const menuItem = document.querySelector(`[data-page="${page}"]`);
        if (menuItem) {
            menuItem.classList.add("active");
        }

        // Mostrar página
        document.querySelectorAll(".page").forEach((p) => {
            p.classList.remove("active");
        });
        const pageElement = document.getElementById(page);
        if (pageElement) {
            pageElement.classList.add("active");
        }

        app.currentPage = page;

        // Renderizar conteúdo da página
        switch (page) {
            case "dashboard":
                renderDashboard();
                break;
            case "categories":
                renderCategories();
                break;
            case "planning":
                renderPlanning();
                break;
            case "projections":
                renderProjections();
                break;
        }
    }

    // Função para abrir modal
    function openModal(modalId) {
        document.getElementById(modalId).classList.add("active");
    }

    // Função para fechar modal
    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove("active");
    }

    // Função para atualizar selects de categoria
    function updateCategorySelects() {
        const transactionSelect = document.getElementById("transaction-category");

        if (!transactionSelect) return;

        // Limpar opções
        transactionSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

        app.categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            transactionSelect.appendChild(option);
        });
    }

    // Função para atualizar a interface após carregar dados
    function updateUI() {
        updateCategorySelects();
        renderDashboard();
        if (app.currentPage === "categories") {
            renderCategories();
        } else if (app.currentPage === "planning") {
            renderPlanning();
        }
    }

    // Função para renderizar dashboard
    function renderDashboard() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Calcular totais
        const monthTransactions = app.transactions.filter((t) => {
            const transactionDate = new Date(t.date);
            return (
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
            );
        });

        const monthIncome = monthTransactions
            .filter((t) => getTransactionType(t) === "income")
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const monthExpenses = monthTransactions
            .filter((t) => getTransactionType(t) === "expense")
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const currentBalance = app.transactions.reduce(
            (sum, t) => sum + (getTransactionType(t) === "income" ? Math.abs(t.amount) : -Math.abs(t.amount)),
            0
        );

        const projectedSavings = monthIncome - monthExpenses;

        // Atualizar cards
        const balanceEl = document.getElementById("current-balance");
        const incomeEl = document.getElementById("month-income");
        const expensesEl = document.getElementById("month-expenses");
        const savingsEl = document.getElementById("projected-savings");

        if (balanceEl) balanceEl.textContent = formatCurrency(currentBalance);
        if (incomeEl) incomeEl.textContent = formatCurrency(monthIncome);
        if (expensesEl) expensesEl.textContent = formatCurrency(monthExpenses);
        if (savingsEl) savingsEl.textContent = formatCurrency(projectedSavings);

        // Renderizar gráficos
        renderExpensesChart();
        renderBalanceChart();

        // Renderizar transações recentes
        renderRecentTransactions();
    }

    // Função para renderizar gráfico de despesas
    function renderExpensesChart() {
        const canvas = document.getElementById("expenses-chart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (app.charts.expenses) {
            app.charts.expenses.destroy();
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthExpenses = app.transactions.filter((t) => {
            const transactionDate = new Date(t.date);
            return (
                getTransactionType(t) === "expense" &&
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
            );
        });

        const expensesByCategory = {};
        monthExpenses.forEach((transaction) => {
            const category = app.categories.find(
                (c) => c.id === transaction.category_id
            );
            const categoryName = category ? category.name : "Sem categoria";
            const categoryColor = category ? category.color : "#666";

            if (!expensesByCategory[categoryName]) {
                expensesByCategory[categoryName] = {
                    amount: 0,
                    color: categoryColor,
                };
            }
            expensesByCategory[categoryName].amount += Math.abs(transaction.amount);
        });

        const labels = Object.keys(expensesByCategory);
        const data = labels.map((label) => expensesByCategory[label].amount);
        const colors = labels.map((label) => expensesByCategory[label].color);

        app.charts.expenses = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: "#fff",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
            },
        });
    }

    // Função para renderizar gráfico de evolução
    function renderBalanceChart() {
        const canvas = document.getElementById("balance-chart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (app.charts.balance) {
            app.charts.balance.destroy();
        }

        // Últimos 6 meses
        const months = [];
        const balances = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);

            const monthTransactions = app.transactions.filter((t) => {
                const transactionDate = new Date(t.date);
                return (
                    transactionDate.getMonth() === date.getMonth() &&
                    transactionDate.getFullYear() === date.getFullYear()
                );
            });

            const monthBalance = monthTransactions.reduce(
                (sum, t) => sum + (getTransactionType(t) === "income" ? Math.abs(t.amount) : -Math.abs(t.amount)),
                0
            );

            months.push(date.toLocaleDateString("pt-BR", { month: "short" }));
            balances.push(monthBalance);
        }

        app.charts.balance = new Chart(ctx, {
            type: "line",
            data: {
                labels: months,
                datasets: [
                    {
                        label: "Saldo Mensal",
                        data: balances,
                        borderColor: "#2ECC71",
                        backgroundColor: "rgba(46, 204, 113, 0.1)",
                        borderWidth: 2,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return formatCurrency(value);
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        });
    }

    // Função para renderizar transações recentes
    function renderRecentTransactions() {
        const tbody = document.getElementById("recent-transactions-table");
        if (!tbody) return;

        tbody.innerHTML = "";

        const recentTransactions = app.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        recentTransactions.forEach((transaction) => {
            const category = app.categories.find(
                (c) => c.id === transaction.category_id
            );
            const row = document.createElement("tr");

            // Determinar o tipo da transação baseado no valor ou categoria
            const transactionType = transaction.amount > 0 ?
                (category && category.type === 'receita' ? 'income' : 'expense') : 'expense';

            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString("pt-BR")}</td>
                <td>${transaction.title || transaction.description}</td>
                <td>${category ? category.name : "Sem categoria"}</td>
                <td class="${transactionType}">${formatCurrency(Math.abs(transaction.amount))}</td>
            `;

            tbody.appendChild(row);
        });
    }



    // Função para renderizar categorias
    function renderCategories() {
        const grid = document.getElementById("categories-grid");
        if (!grid) return;

        grid.innerHTML = "";

        app.categories.forEach((category) => {
            const card = document.createElement("div");
            card.className = "category-card";

            const typeText =
                category.type === "receita"
                    ? "Receita"
                    : category.type === "despesa"
                        ? "Despesa"
                        : "Ambos";

            card.innerHTML = `
                <div class="category-actions">
                    <button class="category-action" onclick="editCategory('${category.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="category-action" onclick="deleteCategory('${category.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="category-icon" style="background-color: ${category.color}">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div class="category-name">${category.name}</div>
                <div class="category-type">${typeText}</div>
            `;

            grid.appendChild(card);
        });
    }

    // Função para renderizar planejamento
    function renderPlanning() {
        updateCurrentMonthDisplay();

        const budgetList = document.getElementById("budget-list");
        if (!budgetList) return;

        budgetList.innerHTML = "";

        const expenseCategories = app.categories.filter(
            (c) => c.type === "despesa"
        );

        if (expenseCategories.length === 0) {
            budgetList.innerHTML = "<p>Nenhuma categoria de despesa encontrada.</p>";
            return;
        }

        expenseCategories.forEach((category) => {
            const budget = app.budgets.find(
                (b) =>
                    b.category_id === category.id &&
                    b.month === app.currentMonth &&
                    b.year === app.currentYear
            );

            // Calcular gastos da categoria no mês
            const monthExpenses = app.transactions
                .filter((t) => {
                    const transactionDate = new Date(t.date);
                    return (
                        getTransactionType(t) === "expense" &&
                        t.category_id === category.id &&
                        transactionDate.getMonth() === app.currentMonth &&
                        transactionDate.getFullYear() === app.currentYear
                    );
                })
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            const budgetAmount = budget ? budget.limit_amount : 0;
            const percentage = budgetAmount > 0 ? (monthExpenses / budgetAmount) * 100 : 0;
            const remaining = budgetAmount - monthExpenses;

            let progressColor = "#2ECC71";
            let statusClass = "";

            if (percentage >= 100) {
                progressColor = "#e74c3c";
                statusClass = "budget-danger";
            } else if (percentage >= 80) {
                progressColor = "#f39c12";
                statusClass = "budget-warning";
            }

            const budgetItem = document.createElement("div");
            budgetItem.className = "budget-item";

            budgetItem.innerHTML = `
                <div class="budget-item-header">
                    <div class="budget-category">
                        <div class="budget-category-icon" style="background-color: ${category.color}">
                            <i class="fas ${category.icon}"></i>
                        </div>
                        <span>${category.name}</span>
                    </div>
                    <span class="${statusClass}">${formatCurrency(budgetAmount)}</span>
                </div>
                <div class="budget-progress">
                    <div class="budget-progress-bar" style="width: ${Math.min(percentage, 100)}%; background-color: ${progressColor}"></div>
                </div>
                <div class="budget-info">
                    <span>Gasto: ${formatCurrency(monthExpenses)}</span>
                    <span class="${statusClass}">Restante: ${formatCurrency(remaining)}</span>
                </div>
            `;

            budgetList.appendChild(budgetItem);
        });

        if (budgetList.children.length === 0) {
            budgetList.innerHTML = "<p>Nenhum orçamento definido para este mês.</p>";
        }
    }

    // Função para atualizar display do mês atual
    function updateCurrentMonthDisplay() {
        const monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const currentMonthYear = document.getElementById("current-month-year");
        if (currentMonthYear) {
            currentMonthYear.textContent = `${monthNames[app.currentMonth]} ${app.currentYear}`;
        }
    }

    // Função para renderizar projeções
    function renderProjections() {
        // Implementação básica das projeções
        console.log("Renderizando projeções...");
    }

    // Função para abrir modal de orçamento
    function openBudgetModal() {
        const budgetCategories = document.getElementById("budget-categories");
        if (!budgetCategories) return;

        budgetCategories.innerHTML = "";

        const expenseCategories = app.categories.filter(c => c.type === "despesa");

        expenseCategories.forEach(category => {
            const existingBudget = app.budgets.find(
                b => b.category_id === category.id &&
                    b.month === app.currentMonth &&
                    b.year === app.currentYear
            );

            const budgetItem = document.createElement("div");
            budgetItem.className = "form-group";

            budgetItem.innerHTML = `
                <label for="budget-${category.id}">
                    <div class="budget-category-label">
                        <div class="budget-category-icon" style="background-color: ${category.color}">
                            <i class="fas ${category.icon}"></i>
                        </div>
                        ${category.name}
                    </div>
                </label>
                <input
                    type="number"
                    id="budget-${category.id}"
                    data-category-id="${category.id}"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value="${existingBudget ? existingBudget.limit_amount : ''}"
                />
            `;

            budgetCategories.appendChild(budgetItem);
        });

        openModal("budget-modal");
    }

    // Event Listeners

    // Botão de adicionar transação
    const addTransactionBtn = document.getElementById("add-transaction-btn");
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener("click", () => {
            app.editingTransaction = null;
            document.getElementById("transaction-modal-title").textContent = "Nova Transação";
            document.getElementById("transaction-form").reset();
            document.getElementById("transaction-date").value = new Date().toISOString().split('T')[0];
            openModal("transaction-modal");
        });
    }

    // Botão de adicionar categoria
    const addCategoryBtn = document.getElementById("add-category-btn");
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener("click", () => {
            app.editingCategory = null;
            document.getElementById("category-modal-title").textContent = "Nova Categoria";
            document.getElementById("category-form").reset();
            openModal("category-modal");
        });
    }

    // Botão de definir orçamento/metas
    const setBudgetBtn = document.getElementById("set-budget-btn");
    if (setBudgetBtn) {
        setBudgetBtn.addEventListener("click", () => {
            openBudgetModal();
        });
    }

    // Navegação de mês no planejamento
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener("click", () => {
            app.currentMonth--;
            if (app.currentMonth < 0) {
                app.currentMonth = 11;
                app.currentYear--;
            }
            renderPlanning();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener("click", () => {
            app.currentMonth++;
            if (app.currentMonth > 11) {
                app.currentMonth = 0;
                app.currentYear++;
            }
            renderPlanning();
        });
    }

    // Formulário de transação
    const transactionForm = document.getElementById("transaction-form");
    if (transactionForm) {
        transactionForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const transactionType = document.querySelector('input[name="transaction-type"]:checked').value;
            let amount = parseFloat(document.getElementById("transaction-amount").value);

            // Se for receita, manter valor positivo; se for despesa, tornar negativo
            if (transactionType === 'expense' && amount > 0) {
                amount = -amount;
            } else if (transactionType === 'income' && amount < 0) {
                amount = Math.abs(amount);
            }

            const transactionData = {
                title: document.getElementById("transaction-description").value,
                amount: amount,
                date: document.getElementById("transaction-date").value,
                category_id: parseInt(document.getElementById("transaction-category").value),
                description: document.getElementById("transaction-description").value,
                type: transactionType
            };

            if (app.editingTransaction) {
                transactionData.id = app.editingTransaction;
            }

            await saveTransaction(transactionData);
            closeModal("transaction-modal");
            showNotification("Transação salva com sucesso!", "success");
        });
    }

    // Formulário de categoria
    const categoryForm = document.getElementById("category-form");
    if (categoryForm) {
        categoryForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const categoryData = {
                name: document.getElementById("category-name").value,
                type: document.querySelector('input[name="category-type"]:checked').value,
                color: document.getElementById("category-color").value,
                icon: document.getElementById("category-icon").value
            };

            if (app.editingCategory) {
                categoryData.id = app.editingCategory;
            }

            await saveCategory(categoryData);
            closeModal("category-modal");
            showNotification("Categoria salva com sucesso!", "success");
        });
    }

    // Formulário de orçamento
    const budgetForm = document.getElementById("budget-form");
    if (budgetForm) {
        budgetForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const budgetInputs = document.querySelectorAll("#budget-categories input[data-category-id]");

                for (const input of budgetInputs) {
                    const categoryId = parseInt(input.dataset.categoryId);
                    const limitAmount = parseFloat(input.value) || 0;

                    if (limitAmount > 0) {
                        const budgetData = {
                            category_id: categoryId,
                            month: `${app.currentYear}-${String(app.currentMonth + 1).padStart(2, '0')}-01`,
                            limit_amount: limitAmount
                        };

                        // Verificar se já existe um orçamento para esta categoria/mês
                        const existingBudget = app.budgets.find(
                            b => b.category_id === categoryId &&
                                b.month === app.currentMonth &&
                                b.year === app.currentYear
                        );

                        if (existingBudget) {
                            budgetData.id = existingBudget.id;
                        }

                        await saveGoal(budgetData);
                    }
                }

                closeModal("budget-modal");
                showNotification("Orçamentos salvos com sucesso!", "success");
                renderPlanning();
            } catch (error) {
                showNotification("Erro ao salvar orçamentos: " + error.message, "error");
            }
        });
    }

    // Botões de fechar modal
    document.querySelectorAll(".close-btn, #cancel-transaction, #cancel-category, #cancel-budget").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const modal = btn.closest(".modal");
            if (modal) {
                modal.classList.remove("active");
            }
        });
    });

    // Color picker
    document.querySelectorAll(".color-option").forEach(option => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
            option.classList.add("selected");
            document.getElementById("category-color").value = option.dataset.color;
        });
    });

    // Icon picker
    document.querySelectorAll(".icon-option").forEach(option => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".icon-option").forEach(o => o.classList.remove("selected"));
            option.classList.add("selected");
            document.getElementById("category-icon").value = option.dataset.icon;
        });
    });



    // Botão de limpar dados
    const clearDataBtn = document.getElementById("clear-data-btn");
    if (clearDataBtn) {
        clearDataBtn.addEventListener("click", async () => {
            if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
                try {
                    // Deletar todas as transações
                    for (const transaction of app.transactions) {
                        await api.deleteTransaction(transaction.id);
                    }

                    // Deletar todas as categorias (exceto as padrão)
                    const defaultCategories = ['Moradia', 'Transporte', 'Alimentação', 'Lazer', 'Saúde', 'Educação'];
                    for (const category of app.categories) {
                        if (!defaultCategories.includes(category.name)) {
                            await api.deleteCategory(category.id);
                        }
                    }

                    await loadData();
                    showNotification("Dados limpos com sucesso!", "success");
                } catch (error) {
                    showNotification("Erro ao limpar dados: " + error.message, "error");
                }
            }
        });
    }

    // Funções globais para os botões de ação
    window.editTransaction = function (id) {
        const transaction = app.transactions.find(t => t.id == id);
        if (transaction) {
            app.editingTransaction = id;
            document.getElementById("transaction-modal-title").textContent = "Editar Transação";
            document.getElementById("transaction-description").value = transaction.title || transaction.description;
            document.getElementById("transaction-amount").value = Math.abs(transaction.amount);
            document.getElementById("transaction-date").value = transaction.date;
            document.getElementById("transaction-category").value = transaction.category_id;

            // Determinar tipo baseado no valor da transação
            const type = transaction.amount >= 0 ? 'income' : 'expense';
            document.querySelector(`input[name="transaction-type"][value="${type}"]`).checked = true;

            openModal("transaction-modal");
        }
    };

    window.deleteTransaction = async function (id) {
        if (confirm("Tem certeza que deseja excluir esta transação?")) {
            try {
                await api.deleteTransaction(id);
                await loadData();
                showNotification("Transação excluída com sucesso!", "success");
            } catch (error) {
                showNotification("Erro ao excluir transação: " + error.message, "error");
            }
        }
    };

    window.editCategory = function (id) {
        const category = app.categories.find(c => c.id == id);
        if (category) {
            app.editingCategory = id;
            document.getElementById("category-modal-title").textContent = "Editar Categoria";
            document.getElementById("category-name").value = category.name;
            document.querySelector(`input[name="category-type"][value="${category.type === 'receita' ? 'income' : 'expense'}"]`).checked = true;
            document.getElementById("category-color").value = category.color;
            document.getElementById("category-icon").value = category.icon;

            // Atualizar seleções visuais
            document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
            document.querySelector(`[data-color="${category.color}"]`)?.classList.add("selected");
            document.querySelectorAll(".icon-option").forEach(o => o.classList.remove("selected"));
            document.querySelector(`[data-icon="${category.icon}"]`)?.classList.add("selected");

            openModal("category-modal");
        }
    };

    window.deleteCategory = async function (id) {
        if (confirm("Tem certeza que deseja excluir esta categoria?")) {
            try {
                await api.deleteCategory(id);
                await loadData();
                showNotification("Categoria excluída com sucesso!", "success");
            } catch (error) {
                showNotification("Erro ao excluir categoria: " + error.message, "error");
            }
        }
    };

    // Inicializar aplicação
    loadData();
});