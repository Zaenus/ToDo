const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskPriority = document.getElementById('task-priority');
const taskList = document.getElementById('task-list');
const taskDueDate = document.getElementById('task-due-date');
const taskCreatedDate = new Date().toISOString().split('T')[0];

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function loadTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add(task.priority);

        li.innerHTML = `
            <div>
                <strong>${task.title}</strong><br>
                <span>${task.description}</span><br>
                <span>Due: ${task.dueDate || 'No due date'}</span><br>
                <span>Created: ${task.createdDate}</span>
            </div>
            <div>
                <button onclick="editTask(${index})" class="edit">Edit</button>
                <button onclick="deleteTask(${index})" class="delete">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(e) {
    e.preventDefault();

    const task = {
        title: taskTitle.value,
        description: taskDescription.value,
        priority: taskPriority.value,
        dueDate: taskDueDate.value,
        createdDate: taskCreatedDate,
    };

    tasks.push(task);
    saveTasks();
    loadTasks();

    taskForm.reset();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    loadTasks();
}

function editTask(index) {
    const task = tasks[index];

    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskPriority.value = task.priority;
    taskDueDate.value = task.dueDate || '';

    taskForm.onsubmit = function (e) {
        e.preventDefault();

        tasks[index] = {
            ...task,
            title: taskTitle.value,
            description: taskDescription.value,
            priority: taskPriority.value,
            dueDate: taskDueDate.value || null,
            createdDate: task.createdDate,
        };

        saveTasks();
        loadTasks();
        taskForm.reset();
        taskForm.onsubmit = addTask;
    };
}

// Initialize
taskForm.onsubmit = addTask;
loadTasks();
