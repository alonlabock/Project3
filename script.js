const quoteElement = document.getElementById("quote");
const weatherElement = document.getElementById("weather");
const taskInput = document.getElementById("task-input");
const taskPriority = document.getElementById("task-priority");
const addTaskButton = document.getElementById("add-task-btn");

// Fetch Inspirational Quote
async function fetchQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        if (!response.ok) throw new Error("Failed to fetch quote");
        const data = await response.json();
        quoteElement.textContent = `"${data.content}" - ${data.author}`;
    } catch (error) {
        quoteElement.textContent = "Keep going! You're doing amazing.";
    }
}

// Fetch Weather
async function fetchWeather() {
    try {
        const apiKey = "a39b3124262724d45663fd3586ac13c1";
        const city = "Miami";
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();
        weatherElement.textContent = `${data.name}: ${data.weather[0].description}, ${data.main.temp.toFixed(
            1
        )}°C`;
    } catch (error) {
        weatherElement.textContent = "Unable to load weather.";
    }
}

// Add Task
function addTask() {
    const taskText = taskInput.value.trim();
    const priority = taskPriority.value;
    
    if (!taskText) {
        alert("Please enter a task.");
        return;
    }

    // Prompt user for the day the task is for
    const day = prompt("Which day is this task for? (e.g., Monday, Tuesday, etc.)").trim();

    // Validate day input
    if (!["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)) {
        alert("Invalid day. Please enter a valid day of the week.");
        return;
    }

    // Create the task item
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item", priority);

    taskItem.innerHTML = `
        <span>${taskText}</span>
        <button class="remove-task-btn"><i class="fa-solid fa-trash"></i></button>
    `;

    // Add task item to the correct day
    const dayBox = document.getElementById(day);
    dayBox.querySelector(".tasks-list").appendChild(taskItem);

    // Save task to localStorage
    saveTaskToLocalStorage(day, taskText, priority);

    // Clear the task input
    taskInput.value = "";

    // Remove task functionality
    const removeTaskButton = taskItem.querySelector(".remove-task-btn");
    removeTaskButton.addEventListener("click", () => {
        dayBox.querySelector(".tasks-list").removeChild(taskItem);
        removeTaskFromLocalStorage(day, taskText);
    });
}

// Save task to localStorage
function saveTaskToLocalStorage(day, taskText, priority) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
    if (!tasks[day]) tasks[day] = [];

    tasks[day].push({ taskText, priority });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    console.log("Task saved to localStorage:", tasks); // Debugging line
}

// Remove task from localStorage
function removeTaskFromLocalStorage(day, taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
    if (!tasks[day]) return;

    tasks[day] = tasks[day].filter(task => task.taskText !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    console.log("Task removed from localStorage:", tasks); // Debugging line
}

// Load tasks from localStorage on page load
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || {};
    for (const day in tasks) {
        const dayBox = document.getElementById(day);
        if (!dayBox) continue;

        const tasksList = dayBox.querySelector(".tasks-list");
        tasks[day].forEach(({ taskText, priority }) => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item", priority);
            taskItem.innerHTML = `
                <span>${taskText}</span>
                <button class="remove-task-btn"><i class="fa-solid fa-trash"></i></button>
            `;
            tasksList.appendChild(taskItem);

            // Remove task functionality
            const removeTaskButton = taskItem.querySelector(".remove-task-btn");
            removeTaskButton.addEventListener("click", () => {
                tasksList.removeChild(taskItem);
                removeTaskFromLocalStorage(day, taskText);
            });
        });
    }

    console.log("Tasks loaded from localStorage:", tasks); // Debugging line
}

// Event listener for adding task
addTaskButton.addEventListener("click", addTask);

// Initial fetch calls
fetchQuote();
fetchWeather();

// Load tasks when page is loaded
loadTasksFromLocalStorage();
