//Constants
const taskConfig = {
  IP: {
    sName: "IP",
    name: "In Progress",
    style: "ipTask",
  },
  NS: {
    sName: "NS",
    name: "Not Started",
    style: "nsTask",
  },
  OH: {
    sName: "OH",
    name: "On Hold",
    style: "ohTask",
  },
  C: {
    sName: "C",
    name: "Completed",
    style: "cTask",
  },
  TR: {
    sName: "TR",
    name: "To Review",
    style: "trTask",
  },
  1: {
    sName: "1",
    name: "High",
    style: "hPriority",
  },
  2: {
    sName: "2",
    name: "Medium",
    style: "mPriority",
  },
  3: {
    sName: "3",
    name: "Low",
    style: "lPriority",
  },
};
const getTaskEl = (item) =>
  `<div  id="${item.id}" class="taskHeadking taskSec">
          <div class="tab tskNmae">
            <span>${item.name}</span>
          </div>
          <div class="tab tskDesc">
            <span>${item.description}</span>
          </div>
          <div class="tab tskStatus">
            <span class=${item.status.style}>${item.status.name}</span>
          </div>
          <div class="tab tskpriority">
            <span class=${item.priority.style}>${item.priority.name}</span>
          </div>
          <div class="tab tskDeadline">
            <span>${item.deadLine}</span>
          </div>
          <div class="tab tskAssignee">
            <span>${item.assignee}</span>
          </div>
          <div  id="${item.id}" class="tab tskEdit">
          <span><i class="fa fa-edit"></i></span>
        </div>
        <div  id="${item.id}" class="tab tskDelete">
        <span><i class="fa fa-trash" aria-hidden="true"></i></span>
      </div>
        </div>
            `;

// Get references to the button and search bar
const searchButton = document.getElementById("searchButton");
const searchInput = document.querySelector("#searchInput");
const searchBar = document.getElementById("searchBar");
const taskBody = document.querySelector(".taskBody");
const tabItem = document.querySelector(".tabItem");
const closeBtn = document.querySelector(".close-btn");
const backDrop = document.querySelector(".backDrop");
const newTaskBtn = document.querySelector("#newTaskBtn");
const addTaskBtn = document.querySelector("#addTaskBtn");
let taskSec;
let taskData;
let currentTaskId;

//DOM content load
//add click eventlistener to update and delete button
document.addEventListener("DOMContentLoaded", async () => {
  await getTask();
});

//Search function
// Add click event listener to the button
searchButton.addEventListener("click", function () {
  // Toggle the display property of the search bar
  if (searchBar.style.display === "none" || searchBar.style.display === "") {
    searchBar.style.display = "block";
    searchInput.focus();
  } else {
    searchBar.style.display = "none";
  }
});

searchInput.addEventListener("input", (event) => {
  const resData = taskData.filter((item) => {
    if (
      item.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      item.priority.name
        .toLowerCase()
        .includes(event.target.value.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(event.target.value.toLowerCase()) ||
      item.status.name
        .toLowerCase()
        .includes(event.target.value.toLowerCase()) ||
      item.deadLine.toLowerCase().includes(event.target.value.toLowerCase()) ||
      item.assignee.toLowerCase().includes(event.target.value.toLowerCase())
    ) {
      taskBody.innerHTML = "";
      return item;
    }
  });

  resData.forEach((item) => {
    taskBody.insertAdjacentHTML("beforeend", getTaskEl(item));
  });

  taskSec = document.querySelectorAll(".tskEdit");
  tskDelete = document.querySelectorAll(".tskDelete");
  taskSec.forEach((item) => {
    item.addEventListener("click", updateTask);
  });
  tskDelete.forEach((item) => {
    item.addEventListener("click", deleteTask);
  });
});

//Tab filter function
tabItem.addEventListener("click", (event) => {
  for (let i = 0; i < tabItem.children.length; i++) {
    tabItem.children[i].classList.remove("selected");
  }

  event.target.classList.add("selected");
  let status = "";
  switch (event.target.classList[0]) {
    case "allTab":
      status = "";
      break;
    case "nsTab":
      status = "NS";
      break;
    case "ipTab":
      status = "IP";
      break;
    case "ohTab":
      status = "OH";
      break;
    case "trTab":
      status = "TR";
      break;
    case "cTab":
      status = "C";
      break;
    default:
      break;
  }

  // Filter Data based on Status
  const resData = taskData.filter((item) => {
    return item.status.sName == status; // Error occurs here
  });

  taskBody.innerHTML = "";
  if (!status) {
    taskData.forEach((item) => {
      taskBody.insertAdjacentHTML("beforeend", getTaskEl(item));
    });
  } else {
    resData.forEach((item) => {
      taskBody.insertAdjacentHTML("beforeend", getTaskEl(item));
    });
  }
  taskSec = document.querySelectorAll(".tskEdit");
  tskDelete = document.querySelectorAll(".tskDelete");
  taskSec.forEach((item) => {
    item.addEventListener("click", updateTask);
  });
  tskDelete.forEach((item) => {
    item.addEventListener("click", deleteTask);
  });
});

//Adding new task function
//opening Overlay and setting the button value
newTaskBtn.addEventListener("click", () => {
  backDrop.style.display = "block";
  addTaskBtn.innerHTML = "Add Task";
});

// Modified add task
addTaskBtn.addEventListener("click", () => {
  const taskName = document.querySelector(".task").value;
  const taskDesc = document.querySelector(".taskDescription").value;
  const taskStatus = document.querySelector(".taskStatus").value;
  const taskPriority = document.querySelector(".taskPriority").value;
  const taskDeadLine = document.querySelector(".taskDeadLine").value;
  const taskAssignee = document.querySelector(".taskAssignee").value;

  const isUpdate = addTaskBtn.innerHTML.includes("Update");

  if (!(taskName && taskDesc && taskStatus && taskPriority && taskDeadLine && taskAssignee)) {
    alert("Please provide all the values");
    return;
  }

  const currentTask = {
    id: isUpdate ? currentTaskId : new Date().toISOString(),
    name: taskName,
    description: taskDesc,
    status: taskConfig[taskStatus],
    priority: taskConfig[taskPriority],
    deadLine: taskDeadLine,
    assignee: taskAssignee,
  };

  if (isUpdate) {
    // If updating an existing task, call the updateTaskPut function
    updateTaskPut(currentTaskId, currentTask);
  } else {
    // If adding a new task, simply send a POST request
    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentTask),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse response JSON
        } else {
          throw new Error("Failed to create task");
        }
      })
      .then((data) => {
        // Handle successful creation
        console.log("Task created successfully:", data);
        // Refresh the task list
        getTask();
        // Clear the form and close the modal
        clearForm();
        closeBtn.click();
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        // Handle error
      });
  }
});

// Update Task function
// Update the Current task by comparing id
const updateTaskPut = (taskId, currentTask) => {
  fetch(`/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentTask),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to update task");
      }
    })
    .then((updatedTask) => {
      console.log("Task updated successfully:", updatedTask);
      // Refresh the task list
      getTask();
      // Clear the form and close the modal
      clearForm();
      closeBtn.click();
    })
    .catch((error) => {
      console.error("Error updating task:", error);
      // Handle error
    });
};

// Updating the Current task by comparing id in the input fileds
const updateTask = (event) => {
  const taskId = event.target.parentElement.id;
  currentTaskId = taskId;
  backDrop.style.display = "block";

  // Fetch task details using taskId
  fetch(`/tasks/${taskId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch task details");
      }
      return response.json();
    })
    .then((task) => {
      // Populate form fields with task details
      document.querySelector(".task").value = task.name;
      document.querySelector(".taskDescription").value = task.description;
      document.querySelector(".taskStatus").value = task.status.sName;
      document.querySelector(".taskPriority").value = task.priority.sName;
      document.querySelector(".taskDeadLine").value = task.deadLine;
      document.querySelector(".taskAssignee").value = task.assignee;

      // Change "Add Task" button to "Update Task" button
      addTaskBtn.innerHTML = "Update Task";
    })
    .catch((error) => console.error("Error fetching task details:", error));
};

// add click eventlistener to close button
closeBtn.addEventListener("click", (event) => {
  //closing the overlay
  backDrop.style.display = "none";
  clearForm();
});

//delete Task
const deleteTask = (event) => {
  taskId = event.target.id;
  fetch(`/tasks/${taskId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Task deleted successfully");
        getTask();
      } else {
        throw new Error("Failed to delete task");
      }
    })
    .catch((error) => console.error("Error deleting task:", error));
};

// Function to fetch tasks from the server
const getTask = async () => {
  try {
    const response = await fetch("http://localhost:3000/tasks");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const tasks = await response.json();
    // Clear existing tasks from the UI
    taskBody.innerHTML = "";
    taskData = tasks;
    console.log(tasks);
    tasks.forEach((item) => {
      taskBody.insertAdjacentHTML("beforeend", getTaskEl(item));
    });

    taskSec = document.querySelectorAll(".tskEdit");
    tskDelete = document.querySelectorAll(".tskDelete");
    taskSec.forEach((item) => {
      item.addEventListener("click", updateTask);
    });
    tskDelete.forEach((item) => {
      item.addEventListener("click", deleteTask);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
  }
};

//clearing the Form
const clearForm = () => {
  const taskName = document.querySelector(".task");
  const taskDesc = document.querySelector(".taskDescription");
  const taskStatus = document.querySelector(".taskStatus");
  const taskPriority = document.querySelector(".taskPriority");
  const taskDeadLine = document.querySelector(".taskDeadLine");
  const taskAssignee = document.querySelector(".taskAssignee");

  taskName.value = "";
  taskDesc.value = "";
  taskDeadLine.value = "";
  taskAssignee.value = "";
};
