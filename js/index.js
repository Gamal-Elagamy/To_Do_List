const formElmement = document.querySelector("form");
const inputElement = document.querySelector("input");
const apiKey = "6764898d60a208ee1fde7308";
const loadingScreen = document.querySelector(".loading")
let allTodos = [];
getAllTodos();

    formElmement.addEventListener("submit", (e)=>{
        e.preventDefault();
        if( inputElement.value.trim().length){
            addTodo()
        }else{
            toastr.error("It can't be left blank")
        }
    } )

    async function addTodo(){
        showScreen()
    const todo = {
        title: inputElement.value,
        apiKey: apiKey,
    };
    const obj = {
        method: "POST",
        body: JSON.stringify(todo),
        headers:{
            "content-type":"application/json",
        },
    };
    const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
        if(response.ok){
            const data = await response.json();    
            if(data.message === "success"){
                toastr.success('A new task added to your list!')
            await getAllTodos()
            formElmement.reset();
            }
        }  
        hideScreen()    
    }

    async function getAllTodos(){
         showScreen()
    const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);
    if (response.ok)
    {
    const data = await response.json(); 
    if(data.message === "success"){
             allTodos = data.todos;
             displayData();
            console.log(allTodos);
           }
        }
         hideScreen() 
    } 

    function displayData(){
        let cartoona = "";
        for(const todo of allTodos){
            cartoona +=`
            <li class="d-flex align-items-center justify-content-between border-bottom pb-2 m-2">
            <span onclick=(markCompleted('${todo._id}')) style = " ${ todo.completed ? "text-decoration-line: line-through" : ""} " class="task-name">${todo.title}</span>
            <div class="d-flex align-items-center justify-content-between gap-3">
            ${ todo.completed ? '<span><i class="fa-regular fa-circle-check" style="color: var(--main-color);"></i></span>': ""}
                <span onclick=(deleteTodo('${todo._id}')) class="icon"><i class="fa-solid fa-trash-can delete-icon"></i></span>
            </div>
            </li>
            `
        }
            document.querySelector(".task-container").innerHTML = cartoona;
            chanageProgress()
    }

    async function deleteTodo(idTodo){
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then( async (result) => {
            if (result.isConfirmed) {
        showScreen()
        const todoData ={
            todoId:idTodo,
        }
        const obj = {
            method: "DELETE",
            body: JSON.stringify(todoData),
            headers:{
                "content-type":"application/json",
            },
        };
        const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj)
        if (response.ok){
        const data = await response.json();
            if(data.message === "success"){
                Swal.fire({
                    title: "Deleted!",
                    text: "Your todo has been deleted.",
                    icon: "success"
                  });
                getAllTodos();
            };
        }  
         hideScreen() 
            }
          });
      
    } 

    async function markCompleted(idTodo){
         showScreen()
        const todoData = {
            todoId:idTodo,
        };
        const obj = {
            method: "PUT",
            body: JSON.stringify(todoData),
            headers:{
                "content-type":"application/json",
            },
        };
        const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
        if (response.ok){
            const data = await response.json();
            if(data.message === "success"){
                Swal.fire({
                    title: "Todo Completed",
                    icon: "success",
                    draggable: true
                  });
                getAllTodos()
            }
        }
         hideScreen() 
    }

    function showScreen(){
        loadingScreen.classList.remove("d-none");
    }

    function hideScreen(){
        loadingScreen.classList.add ("d-none");
    }

    function chanageProgress(){
        const completedTask = allTodos.filter((todo) => todo.completed).length;
        const totalTask = allTodos.length;
        document.querySelector(".progress").style.width = `${(completedTask / totalTask) * 100}%`;
        const statusNumber = document.querySelectorAll(".status-num span");
        statusNumber[0].innerHTML = completedTask;
        statusNumber[1].innerHTML = totalTask;
    }

