import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState} from "react";
import { Toaster } from 'sonner';

function App() {
   const [loggedIn,setLoggedIn] = useState(window.sessionStorage.getItem("LOGIN")==="1"); 
  
  function updateLogin(state)
  {
    setLoggedIn(state);
  }
  if(loggedIn===false)
  {
return (
    <BrowserRouter className="App">
            <Toaster richColors></Toaster>
    <Routes></Routes> 
    </BrowserRouter> );
  }
  else {
return (
    <BrowserRouter className="App">
            <Toaster richColors></Toaster>
    <Routes></Routes> 
    </BrowserRouter> );
  }
}

export default App;
