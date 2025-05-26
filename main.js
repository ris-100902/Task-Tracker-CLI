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
    if (!command[1] || command.length > 2) console.log("Incorrect arguments.\nTo add a task write 'add' and then give description only in double quotes.");
    else {
        const newTask = allTasks.length > 0 ? new Task(allTasks[allTasks.length - 1].id + 1, command[1]) : new Task(1, command[1]);
        allTasks.push(newTask);
    }
}
else if (command[0] === "update") {
    if (!command[1] || !command[2] || command.length > 3) console.log("Incorrect arguments.\nTo update a task write 'update' and then give id and description.");
    else Task.updateDescription(command[1], command[2]);
}
else if (command[0] === "delete") {
    if (!command[1] || command.length > 2) console.log("Incorrect arguments.\nTo delete a task write 'dekete' and then give id of task.");
    else Task.deleteTask(command[1]);
}
else if (command[0] === "mark-in-progress" || command[0] === "mark-done") {
    if (!command[1] || command.length > 2) console.log("Incorrect arguments.\nTo update status of a task write 'mark-in-progress' or 'mark-done' and then give id.");
    else Task.updateProgress(command[0].slice(5), command[1]);
}
else if (command[0] === "list") {
    if (process.argv.length == 3) console.log(allTasks);
    else if (command.length > 2) console.log("Incorrect Arguments");
    else if (command[1] === "done" || command[1] === "in-progress" || command[1] === "pending") Task.listTasksByStatus(command[1]);
}
else console.log("Command not Found");

fs.writeFileSync('./tasks.json', JSON.stringify(allTasks));