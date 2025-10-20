import React from "react";
import "../../style/home.css";
import { useState } from "react";
import "../../style/wininput.css";
import "../../style/lrform.css";
import "../../style/buttons.css";

function PasswordResetForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    email_error: "",
  });

  function validate() {
    var temperrors = {
      email_error: "",
    };
    var valid = true;
    if (!formData.email.trim()) {
      temperrors.email_error = "* Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      temperrors.email_error = "* Email format is invalid";
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
        <h1 className="centeredtxt">Reset your password</h1>
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
        <div className="form-group row">
          <div className="col-lg-auto col-md-12">
            <input type="submit" className="glossy-btn responsive-btn w-100 w-lg-auto" value="Reset password" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default PasswordResetForm;
