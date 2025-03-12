console.log("<<----Pratham kumar----->>");

const status_list = ["Pending", "In Progress", "Completed"];
let Tasks = [];
let edit_TaskId = "";

// Tasks related functions
function createTask(title, Des, status) {
  Tasks.push({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
    title: title,
    description: Des,
    status: status,
  });
  displayTask();
}

function deleteTask(_id) {
  console.log(_id);
  Tasks = Tasks.filter((task) => {
    return task.id != _id;
  });

  displayTask();
  // Close the modal after deletion
  closeDeleteModal(); 
  return;
}

function changeStatus(_id, _status) {
  Tasks = Tasks.map((task) => {
    if (task.id === _id) {
      return { ...task, status: _status };
    }
    return task;
  });
}
function editTask(_id, _title, _description, _status) {
  Tasks = Tasks.map((task) => {
    if (task.id === _id) {
      return { ...task, title: _title, description: _description, status: _status };
    }
    return task;
  });
  edit_TaskId = "";
  displayTask();
}

async function loadTask() {
  // Fetching the data from Task.json
  Tasks =
    JSON.parse(localStorage.getItem("Tasks")) == null
      ? []
      : JSON.parse(localStorage.getItem("Tasks"));
  displayTask();

  //Fetching the Modal.html file
  fetch("modal.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("modal-container").innerHTML = data;
      document.getElementById("create").addEventListener("click", (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value;
        const status = document.getElementById("dropdown").value;
        if (edit_TaskId != "") {
          editTask(edit_TaskId, title, description, status);
        } else if (title != "") {
          createTask(title, description, status);
        }
        document.getElementById("myform").reset();
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
      });
      // Function of close button in Modal
      const closeButton = document.getElementsByClassName("close-button")[0];
      const modal = document.getElementById("myModal");
      closeButton.onclick = function () {
        modal.style.display = "none";
        document.getElementById("myform").reset();
      };
      // Event Listener to disable the Save button
      document.getElementById("title").addEventListener("input",(e)=>{
        console.log(e.target.value)
        if(e.target.value!=""){
          
          document.getElementById("create").disabled=false;
        }
        else{
          document.getElementById("create").disabled=true;
        }
    })
    openModalBtn.onclick = function () {
      const modal = document.getElementById("myModal");
      modal.style.display = "flex"
      const title=document.getElementById("title");
      
      document.getElementById("create").disabled=true;
      
    };
    });
}

function saveDataToLocalStorage() {
  localStorage.setItem("Tasks", JSON.stringify(Tasks));
  console.log("Data saved to localStorage.");
}

// DOM Manipulation


function handleDelete(id) {
  if (id != "") {
    // Open the delete confirmation modal
    openDeleteModal(id); 
  }
}

// Function that display or refesh Tasks
function displayTask() {
  document.getElementById("Pending").innerHTML = "";
  document.getElementById("In_Process").innerHTML = "";
  document.getElementById("Completed").innerHTML = "";

  Tasks.map((task) => {
    console.log(task);
    if (task.status == "Pending") {
      addTask(task, "Pending");
    } else if (task.status == "Completed") {
      addTask(task, "Completed");
    } else {
      addTask(task, "In_Process");
    }
  });
}

// Helper function to generate taskbox 
function addTask(task, parentDiv) {
  // Create the task div
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task-list");
  taskDiv.draggable = true;
  taskDiv.id = task.id;

  // Create the task title div
  const taskTitle = document.createElement("div");
  taskTitle.classList.add("task_title");
  taskTitle.textContent = task.title;

  // Create the delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "❌";
  deleteButton.onclick = function () {
    console.log(task.id);
    handleDelete(task.id);
  };
  //Create the Edit Button
  const EditButton = document.createElement("button");
  EditButton.textContent = "✏️";
  EditButton.onclick = function () {
    console.log(task.id);
    handleDelete(task.id);
  };
  //Edit button eventListener
  EditButton.onclick = function () {
    const modal = document.getElementById("myModal");
    modal.style.display = "flex";
    document.getElementById("create").disabled=true;
    document.getElementById("description").addEventListener("input",(e)=>{
      document.getElementById("create").disabled=false; 
    })
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description == undefined ? "" : task.description;
    document.getElementById("dropdown").value = task.status;
    edit_TaskId = task.id;
  };

  // Append all elements to the task div
  taskDiv.append(taskTitle, EditButton, deleteButton);

  
  document.getElementById(parentDiv).appendChild(taskDiv);

  taskDiv.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("task_id", task.id);
  });
}

// Drag and Drop Feature added
const CompletedArea = document.getElementById("Completed");
const PendingArea = document.getElementById("Pending");
const In_ProcessArea = document.getElementById("In_Process");

function allowDrop(event) {
  event.preventDefault();
}

CompletedArea.addEventListener("drop", function (event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("task_id");

  // Find the task object by ID
  const draggedTask = Tasks.find((task) => task.id === draggedId);

  // Change the status of the dragged task to "Completed"
  if (draggedTask) {
    draggedTask.status = "Completed";
    displayTask(); // Update the display
  }
});

PendingArea.addEventListener("drop", function (event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("task_id");

  // Find the task object by ID
  const draggedTask = Tasks.find((task) => task.id === draggedId);

  // Change the status of the dragged task to "Pending"
  if (draggedTask) {
    draggedTask.status = "Pending";
    displayTask(); // Update the display
  }
});

In_ProcessArea.addEventListener("drop", function (event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("task_id");

  // Find the task object by ID
  const draggedTask = Tasks.find((task) => task.id === draggedId);

  // Change the status of the dragged task to "In_Process"
  if (draggedTask) {
    draggedTask.status = "In_Process";
    displayTask(); // Update the display
  }
});

// Save data to local storage when user close the tab or goes off focus
window.addEventListener("beforeunload", (event) => {
  saveDataToLocalStorage();
});

loadTask();

// Delete Modal Handling
const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.querySelector(".cancel-delete-btn");
const confirmDeleteBtn = document.querySelector(".confirm-delete-btn");


let taskToDelete = null;

// Open the delete confirmation modal
function openDeleteModal(taskId) {
  taskToDelete = taskId;
  deleteModal.style.display = "flex";
}

// Close the delete confirmation modal
function closeDeleteModal() {
  deleteModal.style.display = "none";
}

// Delete the task and close the modal
function deleteTaskFromModal() {
  if (taskToDelete) {
    deleteTask(taskToDelete);
  }
}

// Event listener for the cancel button
cancelDeleteBtn.addEventListener("click", closeDeleteModal);

// Event listener for the confirm delete button
confirmDeleteBtn.addEventListener("click", deleteTaskFromModal);

deleteModal.addEventListener("click", (event) => {
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
});

// disable the Save button

