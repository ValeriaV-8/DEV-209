const register = (
    <div className = "register">
        <h2>Register</h2>
    </div>
)

const registerUsername = (
    <form className = "registerForm">
        <label>Username: </label>
        <input type="text" id="regUsername" placeholder="Enter Username" required=""></input>
    </form>
)    

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

export default Register;
export { RegisterUsername, RegisterPassword };