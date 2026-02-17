import { useState } from 'react'
import './App.css'
import { LoginHeader } from './Header.jsx'
import { Login, Username, Password } from './Login.jsx'
import { Register, RegisterUsername, RegisterPassword } from './Register.jsx'
import { RegisterButton } from './Button.jsx'
import ToDo from './Todo.jsx'



function App() {
  // Sets so the default is user is not logged in
  // and the page shows the login/register page
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Prevents the page from reloading on 'login'
  // and shows the to do list page
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };
 
  return (
    // To Do List page
    <div className="App">
      {isLoggedIn ? (
        <>
          <ToDo />
          {/*Sends the user back to the login/register page*/}
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </>
      ) : (
        // Login/Register Page
        <>
        <LoginHeader />
          <div className="container"> 
            <Login />
            <Username />
            <Password />
            {/*Sends the user to the to do list page*/}
            <button onClick={handleLogin}>Login</button>
          </div>
          <div className="container">
            <Register />
            <RegisterUsername />
            <RegisterPassword />
            <RegisterButton />
          </div>
        </>
      )}
    </div>
  );  
};

export default App
