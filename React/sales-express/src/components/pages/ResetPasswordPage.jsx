import React from "react";
import "../../style/home.css";
import "../../style/lrpage.css";
import PasswordResetForm from "../forms/PaswordResetForm.jsx";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
function ResetPasswordPage() {
  const navigate = useNavigate();
  var cfg1 = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/forgotpassword",
    headers: {},
    data: {
      email: "",
    },
  };
  function onFormSubmit(data) {
    cfg1.data.email = data.email;
    axios(cfg1)
      .then(function (response) {
        if (response.data.code === 200) {
          toast.info("A password reset e-mail has been sent. Please check your inbox.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }
  return (
    <div className="container">
      <a href="/login">
        <span>
          <FaArrowLeft />
        </span>
        &nbsp; Back to login
      </a>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md text-center">
          <img src={require("../../img/se-logo.png")} alt="se-logo" />
          <h2 className="hdg">Reset your password</h2>
          <br></br>
          <PasswordResetForm onSubmit={onFormSubmit}></PasswordResetForm>
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
