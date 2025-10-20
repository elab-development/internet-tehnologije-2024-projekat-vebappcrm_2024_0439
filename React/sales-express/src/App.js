import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState} from "react";
import HomePage from './components/pages/HomePage.jsx';
import AccountsPage from './components/pages/AccountsPage.jsx';
import ContactsPage from './components/pages/ContactsPage.jsx';
import LeadsPage from './components/pages/LeadsPage.jsx';
import OpportunitiesPage from './components/pages/OpportunitiesPage.jsx';
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
      <Route path="accounts" element={<AccountsPage></AccountsPage>}></Route>
      <Route path="contacts" element={<ContactsPage></ContactsPage>}></Route>
      <Route path="leads" element={<LeadsPage></LeadsPage>}></Route>
      <Route path="opportunities" element={<OpportunitiesPage></OpportunitiesPage>}></Route>


      
      </Routes> 
    </BrowserRouter> );
  }
}

export default App;
