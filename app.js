console.log("<<----Pratham kumar----->>");

const status_list=["Pending", "In Progress", "Completed"]
let Tasks=[];
let edit_TaskId="";
//Tasks related functions
function createTask(title,Des,status){
    Tasks.push( {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
        title:title,
        description:Des,
        status:status
    }
    )
    displayTask();
}
function deleteTask(_id){
  console.log(_id);
    Tasks=Tasks.filter((task)=>{
      return task.id!=_id;
    })
  
    displayTask();
    return;
}
function changeStatus(_id,_status){
    Tasks = Tasks.map(task => {
        if (task.id === _id) {
          return { ...task, status: _status };  
        }
        return task;
      });
}
function editTask(_id,_title,_description,_status){
  Tasks = Tasks.map(task => {
    if (task.id === _id) {
      return { ...task, title:_title,description:_description, status: _status };  
    }
    return task;
  });
  edit_TaskId="";
  displayTask();
}
async function loadTask() {
    // Fetching the data from Task.json
    Tasks = JSON.parse(localStorage.getItem("Tasks"))==null?[]:JSON.parse(localStorage.getItem("Tasks"));  
    displayTask(); 
      fetch('modal.html')
      .then(response => response.text())
      .then(data => {
          
          document.getElementById('modal-container').innerHTML = data;
          document.getElementById("create").addEventListener('click',(e)=>{
            e.preventDefault();
            const title = document.getElementById('title').value.trim();
            const description=document.getElementById('description').value;
            const status=document.getElementById('dropdown').value;
            if(edit_TaskId!=""){
              editTask(edit_TaskId,title,description,status);
            }
            else if(title!=""){
              createTask(title,description,status);
             
            }
            document.getElementById('myform').reset();
            const modal = document.getElementById('myModal');
            modal.style.display = "none";
            
          })
          const closeButton = document.getElementsByClassName('close-button')[0];
          const modal = document.getElementById('myModal');
closeButton.onclick = function() {
  modal.style.display = "none";
}
      });
  }
function saveDataToLocalStorage() {
  localStorage.setItem("Tasks", JSON.stringify(Tasks));
  console.log("Data saved to localStorage.");
} 

/*DOM Manupulation*/
openModalBtn.onclick = function() {
  const modal = document.getElementById('myModal');
  modal.style.display = "block";

}

function handleDelete(id){
  if(id!=''){
    deleteTask(id);
  }
}
function displayTask(){
   document.getElementById("Pending").innerHTML="";
   document.getElementById("In_Process").innerHTML="";
   document.getElementById("Completed").innerHTML="";

   Tasks.map((task)=>{
    console.log(task)
    if(task.status=="Pending"){
       addTask(task,'Pending')
               
    }
    else if(task.status=="Completed"){
       addTask(task,"Completed");
    }
    else{
      addTask(task,"In_Process");
    }
   })

}
function addTask(task,parentDiv) {
  // Create the task div
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task-list');
  taskDiv.draggable=true
  taskDiv.id=task.id;
  
  // Create the task title div
  const taskTitle = document.createElement('div');
  taskTitle.classList.add('task_title');
  taskTitle.textContent = task.title;
  //Edit the task
  taskTitle.onclick=function() {
    const modal = document.getElementById('myModal');
    modal.style.display = "block";
    document.getElementById('title').value=task.title;
    document.getElementById('description').value=task.description==undefined?"":task.description;
    document.getElementById('dropdown').value=task.status;
    edit_TaskId=task.id;
  }
  
  

  
  // Create the select dropdown
  const select = document.createElement('select');
  const optionPending = document.createElement('option');
  optionPending.value = 'Pending';
  optionPending.textContent = 'Pending';
  
  const optionInProcess = document.createElement('option');
  optionInProcess.value = 'In_Process';
  optionInProcess.textContent = 'In_Process';
  
  const optionCompleted = document.createElement('option');
  optionCompleted.value = 'Completed';
  optionCompleted.textContent = 'Completed';
  
  select.append(optionPending, optionInProcess, optionCompleted);
  select.value=task.status;

// Add an event listener to the dropdown for the 'change' event
select.addEventListener('change', function(event) {
  // Get the selected option value
  task.status = event.target.value;

   displayTask();
});
  
  // Create the delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = ' ❌';
  deleteButton.onclick = function() {
    console.log(task.id);
    handleDelete(task.id);
  };
  
  // Append all elements to the task div
  taskDiv.append(taskTitle, select, deleteButton);
  
  // Append the task div to the parent container
  document.getElementById(parentDiv).appendChild(taskDiv);
  taskDiv.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData("task_id", task.id);
});
}


// Drag and Drop Feature added
const CompletedArea=document.getElementById("Completed");
const PendingArea=document.getElementById("Pending");
const In_ProcessArea=document.getElementById("In_Process");
CompletedArea.addEventListener("dragover", function(event) {
    event.preventDefault();
});
CompletedArea.addEventListener("drop", function (event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("task_id");

  // Find the task object by ID
  const draggedTask = Tasks.find(task => task.id === draggedId);

  // Change the status of the dragged task to "Completed"
  if (draggedTask) {
      draggedTask.status = "Completed";
      displayTask(); // Update the display
  }
});


PendingArea.addEventListener("dragover", function(event) {
  event.preventDefault();
});
PendingArea.addEventListener("drop", function (event) {
event.preventDefault();
const draggedId = event.dataTransfer.getData("task_id");

// Find the task object by ID
const draggedTask = Tasks.find(task => task.id === draggedId);

// Change the status of the dragged task to "Completed"
if (draggedTask) {
    draggedTask.status = "Pending";
    displayTask(); // Update the display
}
});


In_ProcessArea.addEventListener("dragover", function(event) {
  event.preventDefault();
});
In_ProcessArea.addEventListener("drop", function (event) {
event.preventDefault();
const draggedId = event.dataTransfer.getData("task_id");

// Find the task object by ID
const draggedTask = Tasks.find(task => task.id === draggedId);

// Change the status of the dragged task to "Completed"
if (draggedTask) {
    draggedTask.status = "In_Process";
    displayTask(); // Update the display
}
});


// Save data to local storage



window.addEventListener("beforeunload", (event) => {
  saveDataToLocalStorage();
});
loadTask();






