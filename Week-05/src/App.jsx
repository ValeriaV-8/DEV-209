import { useState } from 'react'
import './App.css'
import Header from './Header.jsx'
import { Login, Username, Password } from './Login.jsx'
import { Register, RegisterUsername, RegisterPassword } from './Register.jsx'
import { RegisterButton } from './Button.jsx'



function App() {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
 
  return (
    <div className="App">
      {isLoggedIn ? (
        <div className="container">
          <h1>My To Do List</h1>
          <ul>
            <li>Hi</li>
          </ul>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>
      ) : (
      <>
      <Header />
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
