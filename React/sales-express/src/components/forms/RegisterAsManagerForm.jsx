import React from "react";
import "../../style/home.css";
import { useState } from "react";
import "../../style/wininput.css";
import "../../style/lrform.css";
import "../../style/buttons.css";

function RegisterAsManagerForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpassword: "",
    updateName: "",
    lastname: "",
    companyname: "",
    companyaddress: "",
    companydesc: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    email_error: "",
    password_error: "",
    cpassword_error: "",
    name_error: "",
    lastname_error: "",
    companyname_error: "",
    companyaddress_error: "",
  });

  function validate() {
    var temperrors = {
      email_error: "",
      password_error: "",
      cpassword_error: "",
      name_error: "",
      lastname_error: "",
      companyname_error: "",
      companyaddress_error: "",
    };
    var valid = true;
    if (!formData.password.trim()) {
      temperrors.password_error = "* Password is required";
      valid = false;
    }

    if (!formData.cpassword.trim()) {
      temperrors.cpassword_error = "* Must confirm password";
      valid = false;
    }

    if (!formData.name.trim()) {
      temperrors.name_error = "* Name is required";
      valid = false;
    }

    if (!formData.lastname.trim()) {
      temperrors.lastname_error = "* Last name is required";
      valid = false;
    }

    if (!formData.password.trim()) {
      temperrors.password_error = "* Password is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      temperrors.email_error = "* Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      temperrors.email_error = "* Email format is invalid";
      valid = false;
    }

    if (!formData.companyname.trim()) {
      temperrors.companyname_error = "* Company name is required";
      valid = false;
    }

    if (!formData.companyaddress.trim()) {
      temperrors.companyaddress_error = "* Address is required";
      valid = false;
    }

    setValidationErrors({ ...temperrors });
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  }

  function handleInput(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="formcontainer">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <h3>Your data</h3>
        </div>
        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="mail" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
          <div className="col">
            <input name="email" type="email" className="form-control" id="mail" placeholder="E-mail" value={formData.email} onInput={handleInput} />
            <small id="emailHelp" className="form-text text-muted">
              Your registered e-mail.
            </small>
            {validationErrors.email_error && <small className="error d-block">{validationErrors.email_error}</small>}
          </div>
        </div>

        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="password" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Password
          </label>
          <div className="col">
            <input name="password" type="password" className="form-control" id="password" placeholder="Password" value={formData.password} onInput={handleInput} />
            {validationErrors.password_error && <small className="error d-block">{validationErrors.password_error}</small>}
          </div>
        </div>

        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="cpassword" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Confirm password
          </label>
          <div className="col">
            <input name="cpassword" type="password" className="form-control" id="cpassword" placeholder="Confirm password" value={formData.cpassword} onInput={handleInput} />
            {validationErrors.cpassword_error && <small className="error d-block">{validationErrors.cpassword_error}</small>}
          </div>
        </div>

        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="name" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
          <div className="col">
            <input name="name" type="text" className="form-control" id="name" placeholder="First name" value={formData.name} onInput={handleInput} />
            {validationErrors.name_error && <small className="error d-block">{validationErrors.name_error}</small>}
          </div>
        </div>

        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="lastname" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Last name
          </label>
          <div className="col">
            <input name="lastname" type="text" className="form-control" id="lastname" placeholder="Last name" value={formData.lastname} onInput={handleInput} />
            {validationErrors.lastname_error && <small className="error d-block">{validationErrors.lastname_error}</small>}
          </div>
        </div>
        <div className="row mb-3">Your company's data</div>
        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="companyname" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Company name
          </label>
          <div className="col">
            <input name="companyname" type="text" className="form-control" id="companyname" placeholder="Company Name" value={formData.companyname} onInput={handleInput} />
            {validationErrors.companyname_error && <small className="error d-block">{validationErrors.companyname_error}</small>}
          </div>
        </div>

        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="companyaddress" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Company Address
          </label>
          <div className="col">
            <input name="companyaddress" type="text" className="form-control" id="companyaddress" placeholder="Company Address" value={formData.companyaddress} onInput={handleInput} />
            {validationErrors.companyaddress_error && <small className="error d-block">{validationErrors.companyaddress_error}</small>}
          </div>
        </div>

        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="companydesc" className="mb-2 mb-lg-0">
            Company description
          </label>
          <div className="">
            <textarea name="companydesc" rows="5" className="form-control" id="companydesc" placeholder="Company description" value={formData.companydesc} onInput={handleInput} />
          </div>
        </div>

        <div className="form-group row">
          <div className="col-lg-auto col-md-12">
            <input type="submit" className="glossy-btn responsive-btn w-100 w-lg-auto" value="Register" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterAsManagerForm;
