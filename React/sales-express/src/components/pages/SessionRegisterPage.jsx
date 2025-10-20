import React, { useState, useEffect } from "react";
import "../../style/home.css";
import "../../style/lrpage.css";
import "../../style/buttons.css";
import RegisterAsManagerForm from "../forms/RegisterAsManagerForm";
import RegisterAsEmployeeForm from "../forms/RegisterAsEmployeeForm";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

function SessionRegisterPage() {
  const [employee, setEmployee] = useState(-1);
  const [isEnabledEmployee, setIsEnabledEmployee] = useState(false);
  const { companyid } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(companyid);
    if (!companyid) {
      setEmployee(0);
      setIsEnabledEmployee(false);
    } else {
      setEmployee(1);
      setIsEnabledEmployee(true);
    }
  }, []);
  var cfg1 = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/registeremployee/" + companyid,
    headers: {},
    data: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      companyname: "",
      companyaddress: "",
      companydesc: "",
    },
  };

  function chkFormSubmit(e) {
    e.preventDefault();
  }

  function employeeSubmit(data) {
    cfg1.data.name = data.name;
    cfg1.data.lastname = data.lastname;
    cfg1.data.email = data.email;
    cfg1.data.password = data.password;
    console.log(data);
    axios(cfg1)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully registered!");
          navigate("/login");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  function managerSubmit(data) {
    console.log(data);
    cfg1.data.name = data.name;
    cfg1.data.lastname = data.lastname;
    cfg1.data.email = data.email;
    cfg1.data.password = data.password;
    cfg1.data.companyname = data.companyname;
    cfg1.data.companyaddress = data.companyaddress;
    cfg1.data.companydesc = data.companydesc;
    cfg1.url = "http://127.0.0.1:8000/api/registermanager";
    axios(cfg1)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          toast.success("Successfully registered!");
          navigate("/login");
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
      <br></br>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md text-center">
          <img src={require("../../img/se-logo.png")} alt="se-logo" />
          <h2 className="hdg">
            Begin your <span className="txtgrey">Sales</span>
            <i>Express</i> journey!
          </h2>
          <br></br>
          <p className="largetext">Who are you?</p>
          <form id="chkform" onSubmit={chkFormSubmit}>
            <div className="form-check form-check-inline">
              <input disabled={!isEnabledEmployee} className="form-check-input " type="radio" name="inlineRadioOptions" id="radioEmployee" checked={employee == 1} onChange={() => setEmployee(1)} />
              <label className="form-check-label" htmlFor="radioEmployee">
                I'm a company employee
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="radioOwner" checked={employee == 0} onChange={() => setEmployee(0)} />
              <label className="form-check-label" htmlFor="radioOwner">
                I'm a company leader
              </label>
            </div>
          </form>
          <br></br>
          {employee == 1 ? <RegisterAsEmployeeForm onSubmit={employeeSubmit} /> : employee == 0 ? <RegisterAsManagerForm onSubmit={managerSubmit}></RegisterAsManagerForm> : ""}
          <br></br>
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default SessionRegisterPage;
