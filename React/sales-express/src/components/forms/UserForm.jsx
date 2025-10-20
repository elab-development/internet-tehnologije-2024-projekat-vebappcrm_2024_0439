import React, { useEffect } from "react";
import "../../style/home.css";
import { useState } from "react";
import "../../style/wininput.css";
import "../../style/buttons.css";
import axios from "axios";
import { toast } from "sonner";
function UserForm({ user, onSubmit, onUpdate, onClear, onClose }) {
  var cuRole = window.sessionStorage.getItem("CURRENT_USER_COM_ROLE");
  console.log(cuRole);
  const [clr, setClr] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(true);
  const [roles, setRoles] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    lastname: "",
    password: "",
    confpassword: "",
    companyrole: "",
    user_id: -1,
  });

  const [updateList, setUpdateList] = useState({
    name: false,
    email: false,
    lastname: false,
    password: false,
    companyrole: false,
  });

  const [validationErrors, setValidationErrors] = useState({
    name_error: "",
  });

  var cfgGetRoles = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/companyroles",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  useEffect(() => {
    if (user != null) {
      setFormData({
        name: user.name,
        email: user.email,
        lastname: user.lastname,
        password: "",
        confpassword: "",
        companyrole: user.companyrole.id,
        user_id: user.id,
      });
      setIsUpdateForm(true);
    }
    axios(cfgGetRoles)
      .then(function (response) {
        if (response.status === 200) {
          setRoles(response.data.companyroles);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }, []);

  function validate() {
    var temperrors = {
      password_error: "",
    };
    var valid = true;
    if (formData.password != formData.confpassword && updateList.password == true) {
      temperrors.password_error = "* Passwords must match.";
    }
    setValidationErrors({ ...temperrors });
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isUpdateForm) {
      if (validate()) {
        var data_to_update = { user_id: formData["user_id"] };
        for (const [key, value] of Object.entries(updateList)) {
          if (value == true) {
            data_to_update = { ...data_to_update, [key]: formData[key] };
          }
        }
        onUpdate(data_to_update);
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

  function handleUlistInput(e) {
    setUpdateList({
      ...updateList,
      [e.target.name]: e.target.checked,
    });
  }

  return (
    <div className="win-input-ctrlbg win-input-rb win-input-hlorange win-input-margin win-input-padding">
      <div className="d-flex align-items-center">
        <div>
          <img src={require("../../img/user-icon-sm.png")} alt="icon"></img>
        </div>
        <div>
          <h1 className="win-hdg">&nbsp;&nbsp;&nbsp;&nbsp;Update User Data</h1>
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
            <input name="name" disabled={!updateList.name} type="text" className="win-input" id="name" placeholder="" value={formData.name} onInput={handleInput} />
          </div>
          <div className="col">
            <input name="name" type="checkbox" value={updateList.name} defaultChecked={updateList.name} onChange={handleUlistInput}></input>
            <label htmlFor="name">Update</label>
          </div>
        </div>
        <div className="row mb-3 align-items-top">
          <label htmlFor="lastname" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Last name
          </label>
          <div className="col-auto">
            <input name="lastname" disabled={!updateList.lastname} type="text" className="win-input" id="lastname" placeholder="" value={formData.lastname} onInput={handleInput} />
          </div>
          <div className="col">
            <input name="lastname" type="checkbox" value={updateList.lastname} defaultChecked={updateList.lastname} onChange={handleUlistInput}></input>
            <label htmlFor="lastname">Update</label>
          </div>
        </div>

        {cuRole == 3 ? (
          <div className="row mb-3 align-items-baseline">
            <label htmlFor="companyrole" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
              Company role
            </label>
            <div className="col-auto">
              {roles !== null ? (
                <select disabled={!updateList.companyrole} id="companyrole" onChange={handleInput} className="win-input" name="companyrole" value={formData.companyrole}>
                  {roles.map((t, i) => (
                    <option key={i} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              ) : (
                " "
              )}
            </div>
            <div className="col">
              <input name="companyrole" type="checkbox" value={updateList.companyrole} defaultChecked={updateList.companyrole} onChange={handleUlistInput}></input>
              <label htmlFor="companyrole">Update</label>
            </div>
          </div>
        ) : (
          " "
        )}

        <div className="row mb-3 align-items-top">
          <label htmlFor="email" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            E-mail
          </label>
          <div className="col-auto">
            <input name="email" disabled={!updateList.email} type="text" className="win-input" id="email" placeholder="" value={formData.email} onInput={handleInput} />
          </div>
          <div className="col">
            <input name="email" type="checkbox" value={updateList.email} defaultChecked={updateList.email} onChange={handleUlistInput}></input>
            <label htmlFor="email">Update</label>
          </div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="password" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Password
          </label>
          <div className="col-auto">
            <input name="password" disabled={!updateList.password} type="password" className="win-input" id="password" placeholder="" value={formData.password} onInput={handleInput} />
          </div>
          <div className="col">
            <input name="password" type="checkbox" value={updateList.password} defaultChecked={updateList.password} onChange={handleUlistInput}></input>
            <label htmlFor="password">Update</label>
          </div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="confpassword" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Confirm password
          </label>
          <div className="col-auto">
            <input name="confpassword" disabled={!updateList.password} type="password" className="win-input" id="confpassword" placeholder="" value={formData.confpassword} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.password_error && <p className="win-input-error d-block">{validationErrors.password_error}</p>}</div>
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

export default UserForm;
