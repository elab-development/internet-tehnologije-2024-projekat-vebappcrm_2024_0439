import React from "react";
import "../../style/home.css";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function LogoutPage({ onLogout }) {
  const navigate = useNavigate();
  function handleLogout() {
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://127.0.0.1:8000/api/logoff",
      headers: {
        Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
      },
    };

    axios(config)
      .then(function (response) {
        toast.info("You logged out.\nThank you for using SalesExpress.");
        window.sessionStorage.setItem("LOGIN", "0");
        onLogout(false);
        navigate("/login");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    handleLogout();
  }, []);
  return <div></div>;
}

export default LogoutPage;
