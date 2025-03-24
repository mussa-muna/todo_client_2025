import { Task } from "./Task.js";

export class Todos {
    #tasks = [];
    #url = "https://todo-server-2025.onrender.com/"; // Hardcoded backend URL

    constructor() {}

    getTasks() {
        return new Promise((resolve, reject) => {
            console.log("Fetching tasks from server...");
            fetch(this.#url)
                .then(response => {
                    console.log("Server response:", response);
                    return response.json();
                })
                .then(data => {
                    console.log("Received tasks:", data);
                    this.#readJson(data);
                    resolve(this.#tasks);
                })
                .catch(err => {
                    console.error("Error fetching tasks:", err);
                    reject(err);
                });
        });
    }

    #readJson(json) {
        this.#tasks = [];
        json.forEach(obj => {
            const task = new Task(obj.id, obj.description);
            this.#tasks.push(task);
        });
    }

    #addToList(taskJson) {
        const task = new Task(taskJson.id, taskJson.description);
        this.#tasks.push(task);
        return task;
    }

    #removeFromList(id) {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
    }

    addTask(description) {
        return new Promise((resolve, reject) => {
            console.log("Adding new task:", description);
            fetch(this.#url + "new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ description: description })
            })
                .then(response => {
                    console.log("Server response:", response);
                    return response.json();
                })
                .then(data => {
                    console.log("Task added successfully:", data);
                    resolve(this.#addToList(data));
                })
                .catch(err => {
                    console.error("Error adding task:", err);
                    reject(err);
                });
        });
    }

    removeTask(id) {
        return new Promise((resolve, reject) => {
            console.log("Removing task with ID:", id);
            fetch(this.#url + "delete/" + id, {
                method: "DELETE"
            })
                .then(response => {
                    console.log("Server response:", response);
                    return response.json();
                })
                .then(data => {
                    console.log("Task removed successfully:", data);
                    this.#removeFromList(id);
                    resolve(data.id);
                })
                .catch(err => {
                    console.error("Error removing task:", err);
                    reject(err);
                });
        });
    }
}
