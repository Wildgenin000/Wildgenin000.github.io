// ==========================
// UTILAJE: Timp Relativ Nativ
// ==========================
// Folosim formatatorul nativ Intl pentru limba română
const rtf = new Intl.RelativeTimeFormat('ro', { numeric: 'auto' });

function getTimeAgo(timestamp) {
    const diffInSeconds = Math.floor((timestamp - Date.now()) / 1000); // va fi un număr negativ
    
    if (Math.abs(diffInSeconds) < 60) return rtf.format(diffInSeconds, 'second');
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) return rtf.format(diffInMinutes, 'minute');
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) return rtf.format(diffInHours, 'hour');
    
    const diffInDays = Math.floor(diffInHours / 24);
    return rtf.format(diffInDays, 'day');
}

// ==========================
// WEB COMPONENT: <task-item>
// ==========================
// Definim comportamentul noului nostru tag HTML
class TaskItem extends HTMLElement {
    // Funcția apelată automat când elementul este adăugat pe ecran
    connectedCallback() {
        const id = this.getAttribute('data-id');
        const text = this.getAttribute('text');
        const completed = this.getAttribute('completed') === 'true';
        const time = Number(id); // Am folosit Date.now() ca ID anterior, deci e și timestamp!

        const className = completed ? 'task-item completed' : 'task-item';

        // Creăm structura internă. Folosim atribute "data-action" pentru Event Delegation
        this.innerHTML = `
            <li class="${className}" data-id="${id}">
                <div class="task-content">
                    <span class="task-text" data-action="toggle">${text}</span>
                    <span class="task-time">${getTimeAgo(time)}</span>
                </div>
                <button class="delete-btn" data-action="delete" aria-label="Șterge">Șterge</button>
            </li>
        `;
    }
}
// Înregistrăm tag-ul în browser
customElements.define('task-item', TaskItem);


// ==========================
// MODEL (Date)
// ==========================
const Model = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    currentFilter: 'all',

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    add(text) {
        this.tasks.push({ id: Date.now(), text: text, completed: false });
        this.save();
    },
    toggle(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) { task.completed = !task.completed; this.save(); }
    },
    remove(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
    },
    getFilteredTasks() {
        if (this.currentFilter === 'active') return this.tasks.filter(t => !t.completed);
        if (this.currentFilter === 'completed') return this.tasks.filter(t => t.completed);
        return this.tasks;
    }
};

// ==========================
// VIEW (Interfață Grafică)
// ==========================
const View = {
    input: document.getElementById('taskInput'),
    list: document.getElementById('taskList'),
    themeBtn: document.getElementById('themeToggle'),

    render(tasks) {
        this.list.innerHTML = ''; 
        const fragment = document.createDocumentFragment();

        tasks.forEach(task => {
            // AICI FOLOSIM WEB COMPONENT-UL NOSTRU!
            const taskElement = document.createElement('task-item');
            taskElement.setAttribute('data-id', task.id);
            taskElement.setAttribute('text', task.text); // Securizat automat prin atribute
            taskElement.setAttribute('completed', task.completed);
            fragment.appendChild(taskElement);
        });

        this.list.appendChild(fragment);
    },

    setDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            this.themeBtn.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            this.themeBtn.textContent = '🌙';
        }
    }
};

// ==========================
// CONTROLLER (Creierul)
// ==========================
const Controller = {
    init() {
        this.initTheme();
        this.bindEvents();
        View.render(Model.getFilteredTasks());
    },

    initTheme() {
        // Citim preferința salvată anterior sau preferința sistemului de operare
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        View.setDarkMode(isDark);
    },

    bindEvents() {
        // --- ADĂUGARE ---
        const handleAdd = () => {
            const text = View.input.value.trim();
            if (text) {
                Model.add(text);
                View.input.value = '';
                View.input.style.height = 'auto';
                View.render(Model.getFilteredTasks());
            }
        };

        document.getElementById('addTaskBtn').addEventListener('click', handleAdd);
        View.input.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleAdd();
        });

        // --- DARK MODE TOGGLE ---
        View.themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            View.setDarkMode(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // --- ACȚIUNI PE SARCINI (Event Delegation actualizat pentru Web Component) ---
        View.list.addEventListener('click', (e) => {
            // Căutăm cel mai apropiat element <li> creat în interiorul Web Component-ului
            const li = e.target.closest('li');
            if (!li) return;
            
            const id = Number(li.getAttribute('data-id'));
            const action = e.target.getAttribute('data-action');

            if (action === 'delete') {
                li.classList.add('fade-out');
                li.addEventListener('animationend', () => {
                    Model.remove(id);
                    View.render(Model.getFilteredTasks());
                });
            } else if (action === 'toggle') {
                Model.toggle(id);
                View.render(Model.getFilteredTasks());
            }
        });

        // --- FILTRARE ---
        document.querySelector('.filters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                Model.currentFilter = e.target.dataset.filter;
                View.render(Model.getFilteredTasks());
            }
        });

        // --- MAGIA: SINCRONIZAREA ÎNTRE TAB-URI (Cross-Tab Sync) ---
        window.addEventListener('storage', (e) => {
            // Dacă un alt tab modifică sarcinile...
            if (e.key === 'tasks') {
                Model.tasks = JSON.parse(e.newValue || '[]');
                View.render(Model.getFilteredTasks());
            }
            // Dacă un alt tab modifică tema (Dark/Light)...
            if (e.key === 'theme') {
                View.setDarkMode(e.newValue === 'dark');
            }
        });
    }
};

Controller.init();
