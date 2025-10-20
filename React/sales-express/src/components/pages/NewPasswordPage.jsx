import React from "react";
import "../../style/home.css";
import "../../style/lrpage.css";
import NewPasswordForm from "../forms/NewPasswordForm.jsx";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "sonner";

function NewPasswordPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  var cfg1 = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/newpassword",
    headers: {},
    data: {
      email: searchParams.get("mail"),
      token: searchParams.get("token"),
      password: "",
    },
  };
  function onFormSubmit(data) {
    console.log(cfg1.data);
    cfg1.data.password = data.password;
    axios(cfg1)
      .then(function (response) {
        console.log(response);
        toast.info("Your password has now been reset. Please log in.");
        navigate("/login");
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
          <h2 className="hdg">Select your new password</h2>
          <br></br>
          <NewPasswordForm onSubmit={onFormSubmit}></NewPasswordForm>
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default NewPasswordPage;
