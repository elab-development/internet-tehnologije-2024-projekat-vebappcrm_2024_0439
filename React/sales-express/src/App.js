import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState} from "react";
import HomePage from './components/pages/HomePage.jsx';
import AccountsPage from './components/pages/AccountsPage.jsx';
import ContactsPage from './components/pages/ContactsPage.jsx';
import LeadsPage from './components/pages/LeadsPage.jsx';
import OpportunitiesPage from './components/pages/OpportunitiesPage.jsx';
import SessionLoginPage from './components/pages/SessionLoginPage.jsx';
import SessionRegisterPage from './components/pages/SessionRegisterPage.jsx';
import ResetPasswordPage from './components/pages/ResetPasswordPage.jsx';
import NewPasswordPage from './components/pages/NewPasswordPage.jsx';
import { Toaster } from 'sonner';
import LogoutPage from './components/pages/LogoutPage.jsx';
import OneLeadPage from './components/pages/OneLeadPage.jsx';
import OneActivityPage from './components/pages/OneActivityPage.jsx';
import OneOpportunityPage from "./components/pages/OneOpportunityPage.jsx";

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
      <Route index element={<SessionLoginPage onLogin={updateLogin}/>} />
      <Route path="login" element={<SessionLoginPage onLogin={updateLogin}/>} />
      <Route path="register/:companyid?" element={<SessionRegisterPage/>}></Route>
      <Route path="forgotpassword" element={<ResetPasswordPage></ResetPasswordPage>}></Route>
      <Route path="newpassword" element={<NewPasswordPage></NewPasswordPage>}></Route>

      
      </Routes> 
    </BrowserRouter> );
  }
  else 
    {
return (
    <BrowserRouter className="App">
            <Toaster richColors></Toaster>
    <Routes>
      <Route index element={<HomePage></HomePage>} />
      <Route path="home" element={<HomePage></HomePage>}></Route>
      <Route path="accounts" element={<AccountsPage></AccountsPage>}></Route>
      <Route path="contacts" element={<ContactsPage></ContactsPage>}></Route>
      <Route path="leads" element={<LeadsPage></LeadsPage>}></Route>
      <Route path="lead/:lead_id" element={<OneLeadPage></OneLeadPage>}></Route>
      <Route path="activity/:activity_id" element={<OneActivityPage></OneActivityPage>}></Route>
      <Route path="opportunities" element={<OpportunitiesPage></OpportunitiesPage>}></Route>
      <Route path="opportunity/:opportunity_id" element={<OneOpportunityPage></OneOpportunityPage>}></Route>
      <Route path="logout" element={<LogoutPage onLogout={updateLogin}></LogoutPage>}></Route>
    


      
      </Routes> 
    </BrowserRouter> );
  }
}

export default App;
