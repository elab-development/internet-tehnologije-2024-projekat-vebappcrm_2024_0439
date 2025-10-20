import React from "react";
import "../../style/home.css";
import { useState } from "react";
import "../../style/wininput.css";
import "../../style/lrform.css";
import "../../style/buttons.css";
import "../../style/lrpage.css";

function NewPasswordForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    password: "",
    cpassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    password_error: "",
    cpassword_error: "",
  });

  function validate() {
    var valid = true;
    var temperrors = {
      password_error: "",
      cpassword_error: "",
    };
    if (!formData.password.trim()) {
      temperrors.password_error = "* Password is required";
      valid = false;
    }

    if (!formData.cpassword.trim()) {
      temperrors.cpassword_error = "* Must confirm password";
      valid = false;
    }

    if (!formData.password.trim()) {
      temperrors.password_error = "* Password is required";
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
          <h3>Your new password</h3>
        </div>
        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="password" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            New password
          </label>
          <div className="col">
            <input name="password" type="password" className="form-control" id="password" placeholder="Password" value={formData.password} onInput={handleInput} />
            {validationErrors.password_error && <small className="error d-block">{validationErrors.password_error}</small>}
          </div>
        </div>

        <div className="form-group row mb-3 align-items-top">
          <label htmlFor="cpassword" className="col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Confirm new password
          </label>
          <div className="col">
            <input name="cpassword" type="password" className="form-control" id="cpassword" placeholder="Confirm password" value={formData.cpassword} onInput={handleInput} />
            {validationErrors.cpassword_error && <small className="error d-block">{validationErrors.cpassword_error}</small>}
          </div>
        </div>

        <div className="form-group row">
          <div className="col-lg-auto col-md-12">
            <input type="submit" className="glossy-btn responsive-btn w-100 w-lg-auto" value="Confirm" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewPasswordForm;
