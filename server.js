// server.js

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());


app.use(express.static('public', { 
  setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
      }
  }
}));


// Function to read tasks from JSON file
function readTasks() {
  try {
    const tasksData = fs.readFileSync('tasks.json');
    return JSON.parse(tasksData);
  } catch (error) {
    return [];
  }
}

// Function to write tasks to JSON file
function writeTasks(tasks) {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
}
app.get('/', (req, res) => {
  // Send the main HTML file or redirect to another route
  res.sendFile(__dirname + '/public/task.html');
});

// Read all tasks
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Read a single task
app.get('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const tasks = readTasks();
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { name, description, status, priority, deadLine, assignee } = req.body;
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    name,
    description,
    status,
    priority,
    deadLine,
    assignee
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const { name, description, status, priority, deadLine, assignee } = req.body;
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      id: taskId,
      name,
      description,
      status,
      priority,
      deadLine,
      assignee
    };
    writeTasks(tasks);
    
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Delete a task
app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const tasks = readTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  if (filteredTasks.length !== tasks.length) {
    writeTasks(filteredTasks);
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Serve the client-side UI
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
