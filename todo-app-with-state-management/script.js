let todos = [];
let idCounter = 1;


function displayTodos() {
  const todoList = document.querySelector('#todoList');
  todoList.innerHTML = ''; 

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todo.done = checkbox.checked;
      saveState();
      displayTodos();
    });

    const description = document.createElement('span');
    description.textContent = todo.description;

    li.appendChild(checkbox);
    li.appendChild(description);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const input = document.querySelector('#todoInput');
  const newTodoDescription = input.value.trim(); 
  
  if (!newTodoDescription) return; 

  const newTodo = {
    id: idCounter++,
    description: newTodoDescription,
    done: false
  };

  todos.push(newTodo);
  saveState(); 
  displayTodos(); 
  input.value = ''; 
}

function saveState() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

document.querySelector('#addTodoButton').addEventListener('click', addTodo);

function loadState() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    todos = JSON.parse(savedTodos);
    idCounter = todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
  }
}

function init() {
  loadState();
  displayTodos();
}
init();
