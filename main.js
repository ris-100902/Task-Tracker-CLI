let allTasks = [];

class Task {
    constructor(id, description) {
        this.id = id;
        this.description = description;
        this.status = "pending";
        this.createdAt = new Date().toUTCString();
        this.updatedAt = this.createdAt;
    }
    static updateDescription(id, desc) {
        let taskToBeUpdatedIndex = allTasks.findIndex(task => task.id == id);
        if (taskToBeUpdatedIndex !== -1) {
            allTasks[taskToBeUpdatedIndex].description = desc;
            allTasks[taskToBeUpdatedIndex].updatedAt = new Date().toUTCString();
        }
    }
    static deleteTask(id) {
        allTasks = allTasks.filter(task => task.id != id);
    }
    static updateProgress(progress, id) {
        let taskToBeUpdatedIndex = allTasks.findIndex(task => task.id == id);
        if (taskToBeUpdatedIndex !== -1) {
            allTasks[taskToBeUpdatedIndex].status = progress;
            allTasks[taskToBeUpdatedIndex].updatedAt = new Date().toUTCString();
        }
    }
    static listTasksByStatus(status) {
        let filteredArray = allTasks.filter(task => task.status === status);
        console.log(filteredArray);
    }
};

const process = require('process');
const fs = require('fs');
if (fs.existsSync('./tasks.json')) allTasks = JSON.parse(fs.readFileSync('./tasks.json', 'utf-8'));

const command = process.argv.slice(2);
if (command[0] === "add") {
    const newTask = allTasks.length > 0 ? new Task(allTasks[allTasks.length - 1].id + 1, command[1]) : new Task(1, command[1]);
    allTasks.push(newTask);
}
else if (command[0] === "update")  Task.updateDescription(command[1], command[2]);
else if (command[0] === "delete")  Task.deleteTask(command[1]);
else if (command[0] === "mark-in-progress") Task.updateProgress("in-progress", command[1]);
else if (command[0] === "mark-done") Task.updateProgress("done", command[1]);
else if (command[0] === "list"){
    if (process.argv.length == 3) console.log(allTasks);
    else if (command[1] === "done" || command[1] === "in-progress" || command[1] === "pending") Task.listTasksByStatus(command[1]);
}

fs.writeFileSync('./tasks.json', JSON.stringify(allTasks));