//Verbindet die HTML mit dem JS
document.addEventListener('DOMContentLoaded', () => {
    //speichert die Elemente in Variablen
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const searchBar = document.getElementById('search-bar');
    const editForm = document.getElementById('edit-form');
    const editPopup = document.getElementById('edit-popup');

    let todos = [];
    let currentEditIndex = null;
//stellt ein evenlistener zum submiten des Formulars her, er antwortet auf das submit button
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title');
        const description = document.getElementById('description');
        const author = document.getElementById('author');
        const category = document.getElementById('category');
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        const progress = document.getElementById('progress');
//holt sich das heutige Datum
        const today = new Date().toISOString().split('T')[0];
//Validierung der Eingaben
        if (!validateText(title.value) || !validateText(description.value) || !validateText(author.value)) {
            alert('Textfelder dürfen nicht nur Leerzeichen enthalten und keine Sonderzeichen (%&*# etc.) enthalten.');
            return;
        }

        if (startDate.value < today) {
            alert('Das Startdatum darf nicht früher als heute sein.');
            return;
        }

        if (endDate.value < startDate.value) {
            alert('Das Enddatum darf nicht früher als das Startdatum sein.');
            return;
        }

        if (!title.value || !description.value || !author.value || !category.value || !startDate.value || !endDate.value) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }

        const todo = {
            title: title.value,
            description: description.value,
            author: author.value,
            category: category.value,
            important: document.getElementById('important').checked,
            urgent: document.getElementById('urgent').checked,
            startDate: startDate.value,
            endDate: endDate.value,
            progress: progress.value
        };

        todos.push(todo);
        sortTodos();
        renderTodos(todos);
        todoForm.reset();
    });
//search bar event listener, reagiert auf dem input vom user
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        aufgabenSuchen(searchTerm);
    });
// bearbeiten der Todos
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('edit-title');
        const description = document.getElementById('edit-description');
        const author = document.getElementById('edit-author');
        const category = document.getElementById('edit-category');
        const startDate = document.getElementById('edit-start-date');
        const endDate = document.getElementById('edit-end-date');
        const progress = document.getElementById('edit-progress');

        const today = new Date().toISOString().split('T')[0];
//Validierung
        if (!validateText(title.value) || !validateText(description.value) || !validateText(author.value)) {
            alert('Textfelder dürfen nicht nur Leerzeichen enthalten und keine Sonderzeichen (%&*# etc.) enthalten.');
            return;
        }

        if (startDate.value < today) {
            alert('Das Startdatum darf nicht früher als heute sein.');
            return;
        }

        if (endDate.value < startDate.value) {
            alert('Das Enddatum darf nicht früher als das Startdatum sein.');
            return;
        }

        if (!title.value || !description.value || !author.value || !category.value || !startDate.value || !endDate.value) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }

        const updatedTodo = {
            title: title.value,
            description: description.value,
            author: author.value,
            category: category.value,
            important: document.getElementById('edit-important').checked,
            urgent: document.getElementById('edit-urgent').checked,
            startDate: startDate.value,
            endDate: endDate.value,
            progress: progress.value
        };

        todos[currentEditIndex] = updatedTodo;
        sortTodos();
        renderTodos(todos);
        editPopup.style.display = 'none';
    });
//Funktion die validiert ob der text sonderzeichen enthät
    function validateText(text) {
        const regex = /^[a-zA-Z0-9 ]+$/;
        return regex.test(text.trim());
    }

    function aufgabenSuchen(query) {
        const gefilterteAufgaben = todos.filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()));
        renderTodos(gefilterteAufgaben);
    }
//funktion sortiert die todos nach Priorität
    function sortTodos() {
        todos.sort((a, b) => {
            const priorityA = getPriority(a);
            const priorityB = getPriority(b);
            return priorityA - priorityB;
        });
    }

    function renderTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `priority-${getPriority(todo)}`;
            li.innerHTML = `
                <h3>${todo.title}</h3>
                <p>${todo.description}</p>
                <p><strong>Autor:</strong> ${todo.author}</p>
                <p><strong>Kategorie:</strong> ${todo.category}</p>
                <p><strong>Startdatum:</strong> ${todo.startDate}</p>
                <p><strong>Enddatum:</strong> ${todo.endDate}</p>
                <div class="progress-bar"><div class="progress" style="width: ${todo.progress}%;"></div></div>
                <button onclick="editTodo(${index})">Edit</button>
                <button onclick="deleteTodo(${index})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }
//funktion die die Priorität der Todos festlegt
    function getPriority(todo) {
        if (todo.important && todo.urgent) return 1;
        if (todo.important) return 2;
        if (todo.urgent) return 3;
        return 4;
    }
//Funktionen die die Todos bearbeiten und löschen

    window.editTodo = function(index) {
        currentEditIndex = index;
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
        
        editPopup.style.display = 'block';
    }

    window.deleteTodo = function(index) {
        todos.splice(index, 1);
        renderTodos(todos);
    }
});
