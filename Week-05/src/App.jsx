import { useState } from 'react'
import './App.css'
import Header from './Header.jsx'
import Login, { Username, Password } from './Login.jsx'

function App() {

  return (
    <>
      <Header />
      <div className="container"> 
        <Login />
        <Username />
        <br/>
        <Password />
      </div>
      <div className="container">
        
      </div>
    </>
  )
}


export default App
