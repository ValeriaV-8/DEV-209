const registerBtn = () => {
    alert('Registeration Success!')
};

// Tells the user that registeration was successful
function RegisterButton() {
    return (
        <button onClick={registerBtn}>Register</button>
    )
};

export {  RegisterButton };