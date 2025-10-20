import React, { useEffect } from "react";
import "../../style/home.css";
import { useState, useRef } from "react";
import "../../style/wininput.css";
import "../../style/buttons.css";
import { MdOutlineManageSearch } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
function AccountForm({ account, onSubmit, onUpdate, onClear, onClose }) {
  const [clr, setClr] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [formTitle, setFormTitle] = useState("New Account");
  const [formData, setFormData] = useState({
    name: "",
    email: " ",
    phone: " ",
    billingaddress: " ",
    industry: " ",
    website: " ",
    account_id: -1,
  });

  const [validationErrors, setValidationErrors] = useState({
    name_error: "",
  });

  useEffect(() => {
    if (account != null) {
      setFormData({
        name: account.name,
        email: account.email,
        phone: account.phone,
        billingaddress: account.billingaddress,
        industry: account.industry,
        account_id: account.id,
        website: account.website,
      });
      setIsUpdateForm(true);
      setFormTitle("Edit Account");
    }
  }, []);

  function validate() {
    var temperrors = {
      name_error: "",
    };
    var valid = true;

    if (!formData.name.trim()) {
      temperrors.name_error = "*";
      valid = false;
    }

    setValidationErrors({ ...temperrors });
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isUpdateForm) {
      if (validate()) {
        onUpdate(formData);
      }
    } else {
      if (validate()) {
        onSubmit(formData);
        onClear(clr);
      }
    }
  }

  function handleInput(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="win-input-ctrlbg win-input-rb win-input-hlorange win-input-margin win-input-padding">
      <div className="d-flex align-items-center">
        <div>
          <img src={require("../../img/account-icon-sm.png")} alt="icon"></img>
        </div>
        <div>
          <h1 className="win-hdg">&nbsp;&nbsp;&nbsp;&nbsp;{formTitle}</h1>
        </div>
      </div>
      <br />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="row mb-3 align-items-top">
          <label htmlFor="name" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Name
          </label>
          <div className="col-auto">
            <input name="name" type="text" className="win-input" id="name" placeholder="" value={formData.name} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.name_error && <p className="win-input-error d-block">{validationErrors.name_error}</p>}</div>
        </div>
        <div className="row mb-3 align-items-top">
          <label htmlFor="billingaddress" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Billing Address
          </label>
          <div className="col-auto">
            <input name="billingaddress" type="text" className="win-input" id="billingaddress" placeholder="" value={formData.billingaddress} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.billingaddress_error && <p className="win-input-error d-block">{validationErrors.billingaddress_error}</p>}</div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="email" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            E-mail
          </label>
          <div className="col-auto">
            <input name="email" type="text" className="win-input" id="email" placeholder="" value={formData.email} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.email_error && <p className="win-input-error d-block">{validationErrors.email_error}</p>}</div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="phone" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Phone
          </label>
          <div className="col-auto">
            <input name="phone" type="text" className="win-input" id="phone" placeholder="" value={formData.phone} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.phone_error && <p className="win-input-error d-block">{validationErrors.phone_error}</p>}</div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="website" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Website
          </label>
          <div className="col-auto">
            <input name="website" type="text" className="win-input" id="website" placeholder="" value={formData.website} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.website_error && <p className="win-input-error d-block">{validationErrors.website_error}</p>}</div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="industry" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Industry
          </label>
          <div className="col-auto">
            <input name="industry" type="text" className="win-input" id="industry" placeholder="" value={formData.industry} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.industry_error && <p className="win-input-error d-block">{validationErrors.industry_error}</p>}</div>
        </div>

        {isUpdateForm == true ? (
          <div className="form-group row">
            <div className="col-lg-auto col-md-12">
              <input type="submit" className="btn-win7 responsive-btn w-100 w-lg-auto" value="Update" />
            </div>
            <div className="col-lg-auto col-md-12">
              <input type="submit" className="btn-win7 responsive-btn w-100 w-lg-auto" value="Close" onClick={onClose} />
            </div>
          </div>
        ) : (
          <div className="form-group row">
            <div className="col-lg-auto col-md-12">
              <input type="submit" className="btn-win7 responsive-btn w-100 w-lg-auto" value="Add" />
            </div>
            <div className="col-lg-auto col-md-12">
              <input type="submit" className="btn-win7 responsive-btn w-100 w-lg-auto" value="Add & New" onClick={() => setClr(true)} />
            </div>
            <div className="col-lg-auto col-md-12">
              <input type="submit" className="btn-win7 responsive-btn w-100 w-lg-auto" value="Close" onClick={onClose} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default AccountForm;
