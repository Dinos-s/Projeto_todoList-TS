"use strict";
class User_ {
    constructor(email, senha) {
        this.email = email;
        this.senha = senha;
    }
}
const emailInput = document.querySelector("input#email");
const senhaInput = document.querySelector("input#senha");
const button = document.querySelector("button#button");
const res = document.querySelector("div#res");
button?.addEventListener('click', (event) => {
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
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find(u => u.email === email);
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
        const newUser = new User(email, senha);
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        res.innerHTML = `<span style="color:green">Usuário ${newUser.email} cadastrado com sucesso! Redirecionando...</span>`;
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    }
});
