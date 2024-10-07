let todos = [];
let idCounter = 1;

function loadState() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    todos = JSON.parse(savedTodos);
    idCounter = todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
  }
}

function saveState() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function displayTodos(filter = 'all') {
  const todoList = document.querySelector('#todoList');
  todoList.innerText = '';

  let filteredTodos = todos;
  if (filter === 'open') {
    filteredTodos = todos.filter(todo => !todo.done);
  } else if (filter === 'done') {
    filteredTodos = todos.filter(todo => todo.done);
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todo.done = checkbox.checked;
      saveState();
      displayTodos(filter);
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
  if (todos.some(todo => todo.description.toLowerCase() === newTodoDescription.toLowerCase())) {
    alert('Duplicate todo');
    return;
  }

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

document.querySelector('#addTodoButton').addEventListener('click', addTodo);
document.querySelector('#todoInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    displayTodos(e.target.value);
  });
});

document.querySelector('#removeDoneButton').addEventListener('click', () => {
  todos = todos.filter(todo => !todo.done);
  saveState();
  displayTodos();
});

function init() {
  loadState();
  displayTodos();
}
init();
