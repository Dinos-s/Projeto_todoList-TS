"use strict";
// Classes principais e seus métodos 
class Task {
    constructor(id, description, priority) {
        this.id = id;
        this.description = description;
        this.priority = priority;
        this.completed = false;
    }
    toggleComplete() {
        this.completed = !this.completed;
    }
}
class User {
    constructor(email, senha) {
        this.email = email;
        this.senha = senha;
        this.tasks = []; // o usuário começa sem tarefas
    }
}
class TaskManager {
    constructor(taskListId, user) {
        this.tasks = [];
        this.taskListEl = document.getElementById(taskListId);
        this.user = user;
        this.tasks = user.tasks || [];
    }
    // sincroniza as tarefas do usuário com o localStorage
    saveUserTasks() {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = users.map((u) => {
            if (u.email === this.user.email) {
                return { ...u, tasks: this.tasks };
            }
            return u;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
    // Adiciona uma nova tarefa e salva as mudanças
    addTask(description, priority) {
        const task = new Task(Date.now(), description, priority);
        this.tasks.push(task);
        this.saveUserTasks();
        this.renderTasks();
    }
    // Alterna o estado de conclusão de uma tarefa e salva as mudanças
    toggleTaskCompletion(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.toggleComplete();
            this.saveUserTasks();
            this.renderTasks();
        }
    }
    // Remove uma tarefa e salva as mudanças
    removeTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveUserTasks();
        this.renderTasks();
    }
    // Filtra as tarefas com base no critério selecionado
    filterTasks(filter) {
        if (filter === "priority")
            return this.tasks.filter(t => t.priority && !t.completed);
        if (filter === "completed")
            return this.tasks.filter(t => t.completed);
        return this.tasks;
    }
    // Renderiza as tarefas na interface
    renderTasks(filter = "all") {
        this.taskListEl.innerHTML = "";
        const filtered = this.filterTasks(filter);
        filtered.forEach(task => {
            const taskEl = document.createElement("div");
            taskEl.className = "task";
            taskEl.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
                <span>${task.description}</span>
                <button class="remove" data-id="${task.id}">Remove</button>
            `;
            this.taskListEl.appendChild(taskEl);
        });
    }
}
// Lógica do login
function LoginPage() {
    const emailInput = document.querySelector("input#email");
    const senhaInput = document.querySelector("input#senha");
    const button = document.querySelector("button#button");
    const res = document.querySelector("div#res");
    // segue o fluxo de login/cadastro, onde valida os campos e autentica o usuário
    button?.addEventListener('click', () => {
        if (!emailInput || !senhaInput || !res)
            return;
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (email === "" || senha === "") {
            res.innerHTML = `<span style="color:red">E-mail ou senha não podem estar vazios!</span>`;
            return;
        }
        if (!emailRegex.test(email)) {
            res.innerHTML = `<span style="color:red">Digite um e-mail válido terminando em .com!</span>`;
            return;
        }
        // busca os usuários salvos no localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        // verifica se o usuário já existe
        const existingUser = users.find(u => u.email === email);
        // se o usuário existir, verifica a senha
        if (existingUser) {
            if (existingUser.senha === senha) {
                res.innerHTML = `<span style="color:green">Login realizado com sucesso! Redirecionando...</span>`;
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            }
            else {
                res.innerHTML = `<span style="color:red">Senha incorreta para o e-mail informado!</span>`;
            }
        }
        else {
            // se o usuário não existir, cria um novo e salva no localStorage
            const newUser = new User(email, senha);
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            res.innerHTML = `<span style="color:green">Usuário ${newUser.email} cadastrado com sucesso! Redirecionando...</span>`;
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        }
    });
}
// Lógica principal da dashboard
function DashboardPage() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }
    const app = new TaskManager("taskList", currentUser);
    window.app = app; // torna o app acessível globalmente para os botões
    document.getElementById("addTaskBtn").addEventListener("click", () => {
        const input = document.getElementById("taskInput");
        const priority = document.getElementById("priorityInput").checked;
        if (input.value.trim()) {
            app.addTask(input.value.trim(), priority);
            input.value = "";
            document.getElementById("priorityInput").checked = false;
        }
    });
    document.querySelectorAll(".filters button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const filter = e.target.dataset.filter || "all";
            app.renderTasks(filter);
        });
    });
    app.renderTasks();
}
// Tipo de página baseado na URL
if (document.body.classList.contains("login-page")) {
    LoginPage();
}
if (document.body.classList.contains("dashboard-page")) {
    DashboardPage();
}
