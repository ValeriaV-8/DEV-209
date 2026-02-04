// Base URL
const API_URL = 'http://localhost:3000';

// Sets cookie (token)
function setAuthCookie(token) {
    const expiry = new Date();

    // Sets the expiry time for the cookie for 1 week
    expiry.setTime(expiry.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Makes the cookie available to website
    document.cookie = `authToken=${token}; expires=${expiry.toUTCString()}; path=/; SameSite=Strict`;
}

// Pulls the token out of the browser
// Needed to update to do list
function getAuthToken() {
    const name = "authToken=";
    
    // Decodes the cookie string
    const decodedCookie = decodeURIComponent(document.cookie);
    
    // Splits the cookie into array
    const ca = decodedCookie.split(';');

    // Looks for the correct array
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        
        // Checks if starts with authToken= 
        // If present, cuts it off and returns just the token string
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }

    // If nothing is found, returns empty string
    return "";
}

async function handleAuth(event, endpoint) {
    // Prevents the webpage from reloading
    event.preventDefault();

    // Checks if you are logging in or registering
    // If in login, grabs input from login inputs
    // If in register, grabs input from register logins
    const usernameID = endpoint === 'login' ? 'loginUsername' : 'regUsername';
    const passwordID = endpoint === 'login' ? 'loginPassword' : 'regPassword';
 
    // Grabs the values from the HTML
    const username = document.getElementById(usernameID).value;
    const password = document.getElementById(passwordID).value;

    try {
        // Sends data to the backend
        const response = await fetch(`${API_URL}/${endpoint}`, {
            // Post used because it is sensitive data
            method: 'POST',
            // Tells the server that the data sent is json
            headers: { 'Content-Type': 'application/json' },
            // Converts the data to string
            body: JSON.stringify({ username, password })
        });

        // Waits for json to respond before proceding
        const data = await response.json();

        if (response.ok) {
            // If login was successful, sends user to todos.html
            if (endpoint === 'login') {
                setAuthCookie(data.token);
                window.location.href = 'todos.html';
            
            // If the user is registering, sends alert    
            } else {
                alert("Registeration successful! Please login.");
            }
        // Alerts user of error
        } else {
            alert("Error: " + data.error);
        }
    // Throws error if not connected to server
    } catch (err) {
        console.error("Connection failed:", err);
        alert("Could not connect to the server.");
    }
}

// Loads the to do list for the user
// if any exists
async function loadTodos() {
    
    // Gets token from cookies
    const token = getAuthToken();
    
    // If no token is returned,
    // will not progress any further
    // because user is not logged in
    if (!token) return;

    try {
        
        // Request to do list from server
        const response = await fetch(`${API_URL}/todos`, {
            
            // Used get so data is not changed in the process
            method: 'GET',
            headers: {  'Authorization': `Bearer ${token}`  }
        });

        // Checks if the server sent the list requested
        if (response.ok) {

            // Converts the data sent into javascript array
            const todos = await response.json();
            
            // Finds the todoList element in html
            const list = document.getElementById('todoList');
            if (!list)  return;
                
            // Clears the current list so duplicates aren't showing
            list.innerHTML = "";
            
            todos.forEach(todo => {
                    
                // Creates new list item
                const li = document.createElement('li');
                
                // Adds completed class to completed tasks
                // Adds edit, delete, and done buttons to tasks
                li.innerHTML = ` 
                    <div class="todo-info">
                        <strong class="${todo.completed ? 'completed' : ''}">${todo.title}</strong>
                        <p class="desc-text">${todo.description || ''}</p>
                    </div>
                    <div class="actions">
                        <button onclick="editTodo('${todo.id}', '${todo.title}')">Edit</button>

                        <button onclick="deleteTodo('${todo.id}')">Delete</button>

                        <button onclick="toggleComplete('${todo.id}', ${todo.completed})"> ${todo.completed ? 'Undo' : 'Done'}</button>
                    </div>
                `;
                    
                // Adds the list item to the html
                list.appendChild(li);
            });
        }   
    } catch (err) {
        
        // Shows error if the server is offline
        console.error("Load failed:", err);
    }
}

// Function for adding to do items to list
async function addTodo() {

    // Grabs to do item from html
    const titleInput = document.getElementById('todoInput');
    const descInput = document.getElementById('todoDesc');

    // Gets saved authToken cookie
    const token = getAuthToken();

    // Prevents empty tasks
    if (!titleInput.value) return;

    try {

        // Sends request to /todos
        const response = await fetch(`${API_URL}/todos`, {
            // Used because sending sensitive data
            method: 'POST',
            headers: {
                
                // Tells the server what data is being sent
                'Content-Type': 'application/json',
                
                // Passes the token in the Authorization header
                'Authorization': `Bearer ${token}`
            },

            // Converts into json string for the server
            body: JSON.stringify({  
                title:   titleInput.value, 
                description: descInput.value
            })
        });

        // If success in saving
        if (response.ok) {
            
            // Clears the input boxes
            titleInput.value = "";
            descInput.value = "";
            
            // Refreshes the list to show the new item
            loadTodos();
        }
    } catch (err) {
        // Shows if the server is offline
        console.error("Add failed:", err);
    }
}

// Removes to do list items from server
async function deleteTodo(id) {

    // Get the authToken
    const token = getAuthToken();

    try {
        // Tells the server where to delete the item from
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Reloads the list without the item
        if (response.ok) {
            loadTodos();
        }

    // Tells you if deletion failed, 
    // most likely from conenction error
    } catch (err) {
        console.error("Delete failed:", err);
    }
}

// Edits to do list item
async function editTodo(id, currentTitle, currentDesc) {
    
    // Asks user to input new task name
    const newTitle = prompt("Edit Task Title: ", currentTitle);

    // If user clicks cancel
    if (newTitle === null) return;

    // Asks user to input new task descprition
    const newDesc = prompt("Edit Task Descprition:", currentDesc);
    
    // If user clicks cancel
    if (newDesc === null) return;
    
    // Needed in order to not save empty tasks
    if (!newTitle) return;

    // Gets authtoken
    const token = getAuthToken();
    try {

        // Tells the server where to put the item
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },

            // Sends the data in string
            body: JSON.stringify({ 
                title: newTitle,
                description: newDesc
            })
        });

        // If it works, reload list
        if (response.ok) loadTodos();

    // If error, probably connection error
    // shows error
    } catch (err) {
        console.error("Edit failed:", err);
    }
}

// The complete checkmark function
async function toggleComplete(id, currentStatus) {
    
    // Gets authtoken
    const token = getAuthToken();
    try {

        // Tells the server where to get the item from
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },

            // Sends the data in string
            body: JSON.stringify({ completed: !currentStatus })
        });

        // If success, reloads list with checkmark
        if (response.ok) loadTodos();
    
    // If fail, shows error
    } catch (err) {
        console.error("Toggle failed:", err);
    }
}


// Logout function
function logout() {

    // Manually expires the cookie and removes it
    document.cookie = "authToken; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Sends the user back to the login/register page
    window.location.href = 'index.html';
}

// Makes sure to run script after the html is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Checks if user is on the login page
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('regForm');

    // If the user is on the login page, listens for submit events
    // from register and login
    if (loginForm) loginForm.addEventListener('submit', (e) => handleAuth(e, 'login'));
    if (regForm) regForm.addEventListener('submit', (e) => handleAuth(e, 'register'));

    // If the user is on the to do list page, loads the to do list
    if (document.getElementById('todoList')) {
        loadTodos();
    }
})

