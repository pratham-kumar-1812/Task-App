console.log("Pratham kumar");
const status_list=["Pending", "In Progress", "Completed"]
let Tasks=[];
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
async function loadTask() {
    // Fetching the data from Task.json
    fetch('./Task.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then(tasks => {
        Tasks = tasks;  
        displayTask(); 
      })
      .catch(err => {
        console.error('Error loading tasks.json:', err);  // Catch errors (network or JSON parsing)
      });
  }
function saveTask(){

}  

/*DOM Manupulation*/
document.getElementById("myform").addEventListener('submit',(e)=>{
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description=document.getElementById('description').value;
  const status=document.getElementById('dropdown').value;
  if(title!=""){
    createTask(title,description,status);
    document.getElementById('myform').reset();
  }
  console.log(Tasks);
})

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
  
  // Create the task title div
  const taskTitle = document.createElement('div');
  taskTitle.classList.add('task_title');
  taskTitle.textContent = task.title;
  
  // Create the select dropdown
  const select = document.createElement('select');
  const optionPending = document.createElement('option');
  optionPending.value = 'Pending';
  optionPending.textContent = 'Pending';
  
  const optionInProcess = document.createElement('option');
  optionInProcess.value = 'In Process';
  optionInProcess.textContent = 'In Process';
  
  const optionCompleted = document.createElement('option');
  optionCompleted.value = 'Completed';
  optionCompleted.textContent = 'Completed';
  
  select.append(optionPending, optionInProcess, optionCompleted);
  select.value=task.status;
  //Update status 
 

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
}
loadTask();

