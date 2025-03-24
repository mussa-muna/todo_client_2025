export class Todos {
    #tasks = [];
    #url = "https://todo-server-2025.onrender.com/"; // Hardcoded backend URL

    constructor() {}

    getTasks() {
        return new Promise((resolve, reject) => {
            fetch(this.#url)
                .then(response => response.json())
                .then(data => {
                    this.#readJson(data);
                    resolve(this.#tasks);
                })
                .catch(err => reject(err));
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
            fetch(this.#url + "new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ description: description })
            })
                .then(response => response.json())
                .then(data => resolve(this.#addToList(data)))
                .catch(err => reject(err));
        });
    }

    removeTask(id) {
        return new Promise((resolve, reject) => {
            fetch(this.#url + "delete/" + id, {
                method: "DELETE"
            })
                .then(response => response.json())
                .then(data => {
                    this.#removeFromList(id);
                    resolve(data.id);
                })
                .catch(err => reject(err));
        });
    }
}
