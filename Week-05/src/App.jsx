import { useState } from 'react'
import './App.css'
import Header from './Header.jsx'
import { Login, Username, Password } from './Login.jsx'
import { Register, RegisterUsername, RegisterPassword } from './Register.jsx'
import { LoginButton, RegisterButton } from './Button.jsx'

function App() {

  return (
    <>
      <Header />
      <div className="container"> 
        <Login />
        <Username />
        <Password />
        <LoginButton />
      </div>
      <div className="container">
        <Register />
        <RegisterUsername />
        <RegisterPassword />
        <RegisterButton />
      </div>
    </>
  )
}

export default App
