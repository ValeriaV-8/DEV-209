// Header for login/register page
const loginheader = (
    <header className="header">
        <h1>To Do List Login</h1>
    </header>
);

// Header for to do list page
const todoheader = (
    <header className="header">
        <h1>To Do List</h1>
    </header>
);

function LoginHeader() {
    return loginheader;
};

function TodoHeader() {
    return todoheader;
};

export {  LoginHeader, TodoHeader  };