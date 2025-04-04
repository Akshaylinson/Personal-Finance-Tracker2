document.addEventListener("DOMContentLoaded", function () {
    const transactionTable = document.getElementById("transaction-table");
    const categoryFilter = document.getElementById("categoryFilter");
    let transactions = [];
    let budgetChart, trendChart;

    // Load JSON Data
    async function loadJSONData() {
        try {
            const response = await fetch("finance_data.json");
            const data = await response.json();

            transactions = data.map(item => ({
                desc: item.Description,
                amount: parseFloat(item.Amount),
                type: item.Type,
                category: item.Category,
                date: new Date(item.Date)
            }));

            populateCategoryFilter();
            updateTable();
            updateCharts();
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    }

    loadJSONData();

    // Populate Category Filter Dropdown
    function populateCategoryFilter() {
        const categories = [...new Set(transactions.map(t => t.category))];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Add New Transaction
    window.addTransaction = function () {
        const desc = document.getElementById("desc").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        if (!desc || isNaN(amount) || !date) {
            alert("Please enter valid details!");
            return;
        }

        const newTransaction = { desc, amount, type, category, date: new Date(date) };
        transactions.push(newTransaction);

        if (![...categoryFilter.options].some(opt => opt.value === category)) {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }

        updateTable();
        updateCharts();
    };

    // Filter Transactions
    window.filterTransactions = function () {
        const startDate = new Date(document.getElementById("startDate").value);
        const endDate = new Date(document.getElementById("endDate").value);
        const categorySelected = categoryFilter.value;

        let filteredData = transactions;

        if (!isNaN(startDate) && !isNaN(endDate)) {
            filteredData = filteredData.filter(t => t.date >= startDate && t.date <= endDate);
        }

        if (categorySelected !== "all") {
            filteredData = filteredData.filter(t => t.category === categorySelected);
        }

        updateTable(filteredData);
        updateCharts(filteredData);
    };

    // Update Table
    function updateTable(filteredData = transactions) {
        transactionTable.innerHTML = "";
        filteredData.forEach(({ desc, amount, type, category, date }) => {
            const row = `<tr>
                <td>${desc}</td>
                <td>${amount.toFixed(2)}</td>
                <td>${type}</td>
                <td>${category}</td>
                <td>${new Date(date).toISOString().split('T')[0]}</td>
            </tr>`;
            transactionTable.innerHTML += row;
        });
    }

    // Update Charts
    function updateCharts(filteredData = transactions) {
        const income = filteredData.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredData.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
        const savings = income - expenses;

        const categoryTotals = {};
        filteredData.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });

        if (budgetChart) budgetChart.destroy();
        budgetChart = new Chart(document.getElementById("budgetChart").getContext("2d"), {
            type: "doughnut",
            data: {
                labels: ["Income", "Expenses", "Savings"],
                datasets: [{
                    data: [income, expenses, savings],
                    backgroundColor: ["#28a745", "#dc3545", "#ffc107"]
                }]
            }
        });

        if (trendChart) trendChart.destroy();
        trendChart = new Chart(document.getElementById("trendChart").getContext("2d"), {
            type: "bar",
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    label: "Amount",
                    data: Object.values(categoryTotals),
                    backgroundColor: ["#4CAF50", "#FF5733", "#007bff", "#ff9800", "#8e44ad", "#27ae60"]
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } }
            }
        });
    }
});
