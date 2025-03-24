import { Todos } from "./js/class/Todos.js";

const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const todos = new Todos();

const renderSpan = (li, text) => {
    const span = document.createElement("span");
    span.textContent = text;
    li.appendChild(span);
};

const renderLink = (li, id) => {
    const a = document.createElement("a");
    a.className = "float-end";
    a.href = "#";
    a.innerHTML = '<i class="bi bi-trash"></i>';
    a.addEventListener("click", (event) => {
        event.preventDefault();
        todos.removeTask(id).then(() => {
            const element = document.querySelector("[data-key='" + id + "']");
            if (element) element.remove();
        });
    });
    li.appendChild(a);
};

const renderTask = (task) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.setAttribute("data-key", task.getId());
    renderSpan(li, task.getText());
    renderLink(li, task.getId());
    list.appendChild(li);
};

const getTasks = () => {
    todos.getTasks()
        .then(data => {
            data.forEach(task => {
                renderTask(task);
            });
            input.disabled = false;
        })
        .catch(err => console.error(err));
};

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText !== "") {
            todos.addTask(taskText).then(task => {
                renderTask(task);
                input.value = "";
                input.focus();
            });
        }
    }
});

getTasks();
