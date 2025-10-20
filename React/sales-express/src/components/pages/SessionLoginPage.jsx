import React from "react";
import "../../style/home.css";
import "../../style/lrpage.css";
import LoginForm from "../forms/LoginForm";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function SessionLoginPage({ onLogin }) {
  const navigate = useNavigate();
  var cfg1 = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/login",
    headers: {},
    data: {
      email: "",
      password: "",
    },
  };

  function formSubmit(data) {
    cfg1.data.email = data.email;
    cfg1.data.password = data.password;
    axios(cfg1)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          toast.success("Successfully logged in!");
          window.sessionStorage.setItem("LOGIN", "1");
          window.sessionStorage.setItem("CURRENT_USER_NAME", response.data.username);
          window.sessionStorage.setItem("CURRENT_AUTH_TOKEN", response.data.access_token);
          window.sessionStorage.setItem("CURRENT_USER_ID", response.data.user_id);
          window.sessionStorage.setItem("CURRENT_USER_COM_ROLE", response.data.companyrole);
          window.sessionStorage.setItem("CURRENT_USER_SYS_ROLE", response.data.sysrole);
          onLogin(true);
          navigate("/home");
        }
      })
      .catch(function (error) {
        if (error.status == 401) {
          toast.error("Wrong e-mail or password");
        } else {
          toast.error("Error: " + error.message);
        }
      });
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md text-center">
          <img src={require("../../img/se-logo.png")} alt="se-logo" />
          <h2 className="hdg">
            Welcome to <span className="txtgrey">Sales</span>
            <i>Express</i>
          </h2>
          <h3 className="subduedhdg">Log in to begin</h3>
          <LoginForm onSubmit={formSubmit} />
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default SessionLoginPage;
