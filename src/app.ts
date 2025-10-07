class User {
    email: string;
    senha: string;

    constructor(email: string, senha: string) {
        this.email = email;
        this.senha = senha;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector<HTMLInputElement>("#email");
    const senhaInput = document.querySelector<HTMLInputElement>("#senha");
    const loginBtn = document.querySelector<HTMLButtonElement>("#loginBtn");
    const registerBtn = document.querySelector<HTMLButtonElement>("#registerBtn");
    const res = document.querySelector<HTMLDivElement>("#res");

    if (!emailInput || !senhaInput || !loginBtn || !registerBtn || !res) return;

    // Preenche o último e-mail logado, se houver
    const lastEmail = localStorage.getItem("lastEmail");
    if (lastEmail) emailInput.value = lastEmail;

    function getUsers(): User[] {
        return JSON.parse(localStorage.getItem("users") || "[]");
    }

    function saveUsers(users: User[]) {
        localStorage.setItem("users", JSON.stringify(users));
    }

    function showMessage(message: string, color: "red" | "green") {
        res!.innerHTML = `<span style="color:${color}">${message}</span>`;
    }

    function validateInputs(email: string, senha: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (!email || !senha) {
            showMessage("E-mail ou senha não podem estar vazios!", "red");
            return false;
        }
        if (!emailRegex.test(email)) {
            showMessage("Digite um e-mail válido terminando em .com!", "red");
            return false;
        }
        return true;
    }

    // LOGIN
    loginBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!validateInputs(email, senha)) return;

        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            showMessage("E-mail não cadastrado. Por favor, cadastre-se primeiro!", "red");
        } else if (user.senha !== senha) {
            showMessage("Senha incorreta para o e-mail informado!", "red");
        } else {
            // Salva o usuário logado
            localStorage.setItem("lastEmail", user.email);

            showMessage("Login realizado com sucesso! Redirecionando...", "green");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        }
    });

    // CADASTRO
    registerBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!validateInputs(email, senha)) return;

        const users = getUsers();
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            showMessage("E-mail já cadastrado! Faça login.", "red");
        } else {
            const newUser = new User(email, senha);
            users.push(newUser);
            saveUsers(users);

            // Salva o usuário logado
            localStorage.setItem("lastEmail", newUser.email);

            showMessage("Usuário cadastrado com sucesso! Redirecionando...", "green");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        }
    });
});
