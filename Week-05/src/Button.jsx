const loginBtn = () => {
    alert('You clicked the login button!')
};

const registerBtn = () => {
    alert('You clicked the register button!')
};

function LoginButton() {
    return (
        <button onClick={loginBtn}>Login</button>
    )
};

function RegisterButton() {
    return (
        <button onClick={registerBtn}>Register</button>
    )
};

export { LoginButton, RegisterButton };