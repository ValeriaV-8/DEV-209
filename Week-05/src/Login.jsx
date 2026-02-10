const login = (
    <div className = "login">
        <h2>Login</h2>
    </div>
);

const username = (
    <form className = "loginForm">
        <label>Username: </label>
        <input type="text"  id="loginUsername" placeholder="Enter Username" 
        name="username" required/>
    </form>
) 

const password = (
    <form className = "loginForm">
        <label>Password: </label>
        <input type="password"  id="loginPassword" placeholder="Enter Password"
        name="password" required/>
    </form>
)

function Login() {
    return login;
};

function Username() {
    return username;
}

function Password() {
    return password;
}

export { Login, Username, Password };
