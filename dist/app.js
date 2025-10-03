"use strict";
class User {
    constructor(email, senha) {
        this.email = email;
        this.senha = senha;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector("input#email");
    const senhaInput = document.querySelector("input#senha");
    const loginBtn = document.querySelector("button#loginBtn");
    const registerBtn = document.querySelector("button#registerBtn");
    const res = document.querySelector("div#res");
    function getUsers() {
        return JSON.parse(localStorage.getItem("users") || "[]");
    }
    function saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
    }
    function validateInputs(email, senha) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (!email || !senha) {
            res.innerHTML = `<span style="color:red">E-mail ou senha não podem estar vazios!</span>`;
            return false;
        }
        if (!emailRegex.test(email)) {
            res.innerHTML = `<span style="color:red">Digite um e-mail válido terminando em .com!</span>`;
            return false;
        }
        return true;
    }
    // LOGIN
    loginBtn === null || loginBtn === void 0 ? void 0 : loginBtn.addEventListener("click", () => {
        if (!emailInput || !senhaInput || !res)
            return;
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        if (!validateInputs(email, senha))
            return;
        const users = getUsers();
        const user = users.find(u => u.email === email);
        if (!user) {
            res.innerHTML = `<span style="color:red">E-mail não cadastrado. Por favor, cadastre-se primeiro!</span>`;
        }
        else if (user.senha !== senha) {
            res.innerHTML = `<span style="color:red">Senha incorreta para o e-mail informado!</span>`;
        }
        else {
            res.innerHTML = `<span style="color:green">Login realizado com sucesso! Redirecionando...</span>`;
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        }
    });
    // CADASTRO
    registerBtn === null || registerBtn === void 0 ? void 0 : registerBtn.addEventListener("click", () => {
        if (!emailInput || !senhaInput || !res)
            return;
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        if (!validateInputs(email, senha))
            return;
        const users = getUsers();
        const userExists = users.some(u => u.email === email);
        if (userExists) {
            res.innerHTML = `<span style="color:red">E-mail já cadastrado! Faça login.</span>`;
        }
        else {
            const newUser = new User(email, senha);
            users.push(newUser);
            saveUsers(users);
            res.innerHTML = `<span style="color:green">Usuário cadastrado com sucesso! Agora faça login.</span>`;
        }
    });
});
