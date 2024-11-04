let todos = [];
const API_URL = "http://localhost:3010/todos";  

async function loadTodos() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    todos = data.map(todo => ({
      id: todo.id,
      description: todo.description,
      done: todo.done,
    }));
    displayTodos();
  } catch (error) {
    console.error('Error loading todos:', error);
  }
}

async function addTodo() {
  const input = document.querySelector('#todoInput');
  const newTodoDescription = input.value.trim();
  
  if (!newTodoDescription) return; 
  if (todos.some(todo => todo.description.toLowerCase() === newTodoDescription.toLowerCase())) {
    alert('Duplicate todo');
    return;
  }

  const newTodo = {
    description: newTodoDescription,
    done: false
  };

  try {
    const response = await fetch(API_URL, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });
    const savedTodo = await response.json();
    todos.push(savedTodo);
    displayTodos();
    input.value = '';
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}

async function toggleTodoDone(todo) {
  try {
    await fetch(`${API_URL}/${todo.id}`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, done: !todo.done })
    });
    todo.done = !todo.done;
    displayTodos();
  } catch (error) {
    console.error('Error updating todo:', error);
  }
}

async function removeDoneTodos() {
  try {
    const doneTodos = todos.filter(todo => todo.done);
    for (const todo of doneTodos) {
      await fetch(`${API_URL}/${todo.id}`, { method: 'delete' });
    }
    todos = todos.filter(todo => !todo.done);
    displayTodos();
  } catch (error) {
    console.error('Error deleting todos:', error);
  }
}

function displayTodos(filter = 'all') {
  const todoList = document.querySelector('#todoList');
  todoList.innerHTML = '';

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
    checkbox.addEventListener('change', () => toggleTodoDone(todo));

    const description = document.createElement('span');
    description.textContent = todo.description;

    li.appendChild(checkbox);
    li.appendChild(description);
    todoList.appendChild(li);
  });
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

document.querySelector('#removeDoneButton').addEventListener('click', removeDoneTodos);

loadTodos();
