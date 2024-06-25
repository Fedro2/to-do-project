document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const editPopup = document.getElementById('edit-popup');
    const editForm = document.getElementById('edit-form');
    
    let todos = [];
    let editIndex = null;

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const author = document.getElementById('author').value;
        const category = document.getElementById('category').value;
        const important = document.getElementById('important').checked;
        const urgent = document.getElementById('urgent').checked;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const progress = document.getElementById('progress').value;
        
        const todo = { title, description, author, category, important, urgent, startDate, endDate, progress };
        todos.push(todo);
        renderTodos();
        todoForm.reset();
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-title').value;
        const description = document.getElementById('edit-description').value;
        const author = document.getElementById('edit-author').value;
        const category = document.getElementById('edit-category').value;
        const important = document.getElementById('edit-important').checked;
        const urgent = document.getElementById('edit-urgent').checked;
        const startDate = document.getElementById('edit-start-date').value;
        const endDate = document.getElementById('edit-end-date').value;
        const progress = document.getElementById('edit-progress').value;
        
        todos[editIndex] = { title, description, author, category, important, urgent, startDate, endDate, progress };
        renderTodos();
        closeEditPopup();
    });

    function renderTodos() {
        todoList.innerHTML = '';
        // Sort todos to ensure priority order: red, yellow, green, blue
        todos.sort((a, b) => {
            const priorityA = getPriority(a.important, a.urgent);
            const priorityB = getPriority(b.important, b.urgent);
            return priorityA - priorityB;
        });
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            const priority = getPriority(todo.important, todo.urgent);
            li.className = `priority-${priority}`;
            li.innerHTML = `
                <div>
                    <p>Titel: ${todo.title}</p>
                    <p>Description: ${todo.description}</p>
                    <p>Autor: ${todo.author}</p>
                    <p>Kategorie: ${todo.category}</p>
                    <p>Wichtig: ${todo.important ? 'Ja' : 'Nein'}</p>
                    <p>Dringend: ${todo.urgent ? 'Ja' : 'Nein'}</p>
                    <p>Start Date: ${todo.startDate}</p>
                    <p>End Date: ${todo.endDate}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${todo.progress}%"></div>
                    </div>
                </div>
                <div>
                    <button onclick="edit(${index})">Edit</button>
                    <button onclick="done(${index})">Done</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    window.edit = (index) => {
        editIndex = index;
        const todo = todos[index];
        document.getElementById('edit-title').value = todo.title;
        document.getElementById('edit-description').value = todo.description;
        document.getElementById('edit-author').value = todo.author;
        document.getElementById('edit-category').value = todo.category;
        document.getElementById('edit-important').checked = todo.important;
        document.getElementById('edit-urgent').checked = todo.urgent;
        document.getElementById('edit-start-date').value = todo.startDate;
        document.getElementById('edit-end-date').value = todo.endDate;
        document.getElementById('edit-progress').value = todo.progress;
        openEditPopup();
    };

    window.done = (index) => {
        todos.splice(index, 1);
        renderTodos();
    };

    function openEditPopup() {
        editPopup.style.display = 'block';
    }

    function closeEditPopup() {
        editPopup.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == editPopup) {
            closeEditPopup();
        }
    };

    function getPriority(important, urgent) {
        if (important && urgent) return 1; // Red
        if (important && !urgent) return 2; // Yellow
        if (!important && urgent) return 3; // Green
        return 4; // Blue
    }
});
