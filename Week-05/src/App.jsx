import { useState } from 'react'
import './App.css'
import { LoginHeader, TodoHeader } from './Header.jsx'
import { Login, Username, Password } from './Login.jsx'
import { Register, RegisterUsername, RegisterPassword } from './Register.jsx'
import { RegisterButton } from './Button.jsx'



function App() {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };
 
  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <TodoHeader />
          <h1>My To Do List</h1>
          <ul>
            <li>Hi</li>
            <li>Lo</li>
          </ul>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </>
      ) : (
        <>
        <LoginHeader />
          <div className="container"> 
            <Login />
            <Username />
            <Password />
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
