import { Todos } from "./js/class/Todos.js";

const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const errorDiv = document.querySelector("#error-message");
const todos = new Todos();

const showError = (message) => {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 3000);
};

const renderSpan = (li, text) => {
    const span = document.createElement("span");
    span.textContent = text;
    li.appendChild(span);
};

const renderLink = (li, id) => {
    const a = document.createElement("a");
    a.className = "float-end text-danger";
    a.href = "#";
    a.innerHTML = '<i class="bi bi-trash"></i>';
    a.addEventListener("click", (event) => {
        event.preventDefault();
        todos.removeTask(id).then(() => {
            const element = document.querySelector("[data-key='" + id + "']");
            if (element) element.remove();
        }).catch(err => {
            showError("Failed to delete task. Please try again.");
        });
    });
    li.appendChild(a);
};

const renderTask = (task) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.setAttribute("data-key", task.getId());
    renderSpan(li, task.getText());
    renderLink(li, task.getId());
    list.appendChild(li);
};

const getTasks = () => {
    input.disabled = true;
    todos.getTasks()
        .then(data => {
            list.innerHTML = "";
            data.forEach(task => {
                renderTask(task);
            });
            input.disabled = false;
            input.focus();
        })
        .catch(err => {
            showError("Failed to load tasks. Please refresh the page.");
            input.disabled = false;
        });
};

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText !== "") {
            input.disabled = true;
            todos.addTask(taskText).then(task => {
                renderTask(task);
                input.value = "";
                input.disabled = false;
                input.focus();
            }).catch(err => {
                showError("Failed to add task. Please try again.");
                input.disabled = false;
            });
        }
    }
});

getTasks();
