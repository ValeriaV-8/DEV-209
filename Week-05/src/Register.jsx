// Register header
const register = (
    <div className = "register">
        <h2>Register</h2>
    </div>
)

// Registering username form
const registerUsername = (
    <form className = "registerForm">
        <label>Username: </label>
        <input type="text" id="regUsername" placeholder="Enter Username" required=""></input>
    </form>
)    

// Registering password form
const registerPassword = (
    <form className = "registerForm">
        <label>Password: </label>
        <input type="password" id="regPassword" placeholder="Enter Password" required=""></input>
    </form>
)

function Register() {
    return register;
}

function RegisterUsername() {
    return registerUsername;
}

function RegisterPassword() {
    return registerPassword;
}

export { Register, RegisterUsername, RegisterPassword };
