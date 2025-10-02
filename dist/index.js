"use strict";
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
class TaskManager {
    constructor(taskListId) {
        this.tasks = [];
        this.taskListEl = document.getElementById(taskListId);
    }
    addTask(description, priority) {
        const task = new Task(Date.now(), description, priority);
        this.tasks.push(task);
        this.renderTasks();
    }
    removeTask(id) {
        this.tasks = this.tasks.filter(t => t.id != id);
        this.renderTasks();
    }
    toggleTaskCompletion(id) {
        const task = this.tasks.find(t => t.id == id);
        if (task)
            task.toggleComplete();
        this.renderTasks();
    }
    filterTasks(filter) {
        if (filter == "priority")
            return this.tasks.filter(t => t.priority && !t.completed);
        if (filter == "completed")
            return this.tasks.filter(t => t.completed);
        return this.tasks;
    }
    renderTasks(filter = "all") {
        this.taskListEl.innerHTML = "";
        const filtered = this.filterTasks(filter);
        filtered.forEach(task => {
            const li = document.createElement("li");
            li.className = `task ${task.priority ? "priority" : ""} ${task.completed ? "completed" : ""}`;
            li.innerHTML = `
        <span>${task.description}</span>
        <div>
          <button onclick="app.toggleTaskCompletion(${task.id})">✔</button>
          <button onclick="app.removeTask(${task.id})">✖</button>
        </div>
      `;
            this.taskListEl.appendChild(li);
        });
    }
}
const app = new TaskManager("taskList");
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
        document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const filter = e.target.getAttribute("data-filter");
        app.renderTasks(filter);
    });
});
