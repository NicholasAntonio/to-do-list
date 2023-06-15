const taskInput = document.querySelector('.task-input input'),
filters = document.querySelectorAll('.filters span'),
clear = document.querySelector('.clear-btn'),
taskField = document.querySelector('.task-field');

let editId,isEditTask = false, toDos = JSON.parse(localStorage.getItem('toDo-list'));

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active');
        btn.classList.add('active');
        showToDo(btn.id);
    });
});

function showToDo(filter){
    let liTag = '';
    if(toDos){
        toDos.forEach((toDo, id) => {
          let completed = toDo.status == 'completed' ? 'checked': '';
          if(filter == toDo.status || filter == 'all'){
            liTag += `<li class = "task">
                <label for = "${id}">
                    <input onclick = "updateStatus(this)"
                    type ="checkbox" id ="${id}" ${completed}>
                    <p class = "${completed}"> ${toDo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class='bx bx-dots-horizontal-rounded'></i>
                    <ul class= "task-menu">
                        <li onclick='editTask(${id}, "${toDo.name}")'><i class='bx bxs-edit-alt' ></i>Editar</li>
                        <li onclick = 'deleteTask(${id},"${filter}")'><i class='bx bxs-message-square-x'></i>Deletar</li>
                    </ul>    
                </div>   
                </li>`;
          }  
        });
    } 
    
    taskField.innerHTML = liTag || `<span>Você não tem nenhuma tarefa</span>`;
    let checkTask = taskField.querySelectorAll('.task');
    !checkTask.lenght ? clear.classList.remove('active') : clear.classList.add('active');
    taskField.offsetHeight >= 300 ? taskField.classList.add('overflow') : taskField.classList.remove('overflow');
}

showToDo('all');

function showMenu(selectedTask){
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add('show');
    document.addEventListener('click', e =>{
        if(e.target.tagName != 'I' || e.target != selectedTask){
            menuDiv.classList.remove('show');
        }
    });

}

function updateStatus(selectedTask){    
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add('checked');
        toDos[selectedTask.id].status = 'completed';
    }else{
        taskName.classList.remove('checked');
        toDos[selectedTask.id].status = 'pending';
    }
    localStorage.setItem('toDo-list', JSON.stringify.apply(toDos));
}

function editTask (taskId, textName){
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add('active');
}

function deleteTask(deleteId,filter){
    isEditTask = false;
    toDos.splice(deleteId,1);
    localStorage.setItem('toDo-list', JSON.stringify(toDos));
    showToDo(filter);
}

clear.addEventListener('click', () =>{
    isEditTask = false;
    toDos.splice(0, toDos.lenght);
    localStorage.setItem('toDo-list', JSON.stringify(toDos));
    showToDo();
})


taskInput.addEventListener('keyup', e =>{
    let userTask = taskInput.value.trim();
    if(e.key == 'Enter' && userTask){
        if(!isEditTask){
            toDos = !toDos ? [] : toDos;
            let taskInfo = {name: userTask, status: 'pending'};
            toDos.push(taskInfo);
        }else{
            isEditTask = false;
            toDos[editId].name = userTask;
        }
        taskInput.value = '';
        localStorage.setItem('toDo-list', JSON.stringify(toDos));
        showToDo(document.querySelector('span.active').id);
    }
});