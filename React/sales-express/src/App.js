import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState} from "react";
import HomePage from './components/pages/HomePage.jsx';
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
    <Routes>

      
      </Routes> 
    </BrowserRouter> );
  }
  else {
return (
    <BrowserRouter className="App">
            <Toaster richColors></Toaster>
    <Routes>
      <Route index element={<HomePage></HomePage>} />
      <Route path="home" element={<HomePage></HomePage>}></Route>
      
      </Routes> 
    </BrowserRouter> );
  }
}

export default App;
