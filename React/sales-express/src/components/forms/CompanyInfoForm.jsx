import React, { useEffect } from "react";
import "../../style/home.css";
import { useState } from "react";
import "../../style/wininput.css";
import "../../style/buttons.css";
function CompanyInfoForm({ company, onSubmit, onUpdate, onClear, onClose }) {
  const [clr, setClr] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(true);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    imgpath: "",
    description: "",
    address: "",
  });

  const [updateList, setUpdateList] = useState({
    name: false,
    imgpath: false,
    description: false,
    address: false,
  });

  const [validationErrors, setValidationErrors] = useState({
    name_error: "",
  });

  useEffect(() => {
    if (company != null) {
      setFormData({
        name: company.name,
        description: company.description,
        imgpath: company.imgpath,
        address: company.address,
      });
      setIsUpdateForm(true);
      setPreview(company.imgpath);
    }
  }, []);

  function validate() {
    var temperrors = {};
    var valid = true;
    setValidationErrors({ ...temperrors });
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isUpdateForm) {
      if (validate()) {
        var data_to_update = {};
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

  const handleFileChange = (e) => {
    var file = e.target.files[0];
    setFormData({ ...formData, ["imgpath"]: file });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="win-input-ctrlbg win-input-rb win-input-hlorange win-input-margin win-input-padding">
      <div className="d-flex align-items-center">
        <div>
          <img src={require("../../img/company-icon-sm.png")} alt="icon"></img>
        </div>
        <div>
          <h1 className="win-hdg">&nbsp;&nbsp;&nbsp;&nbsp;Update Company Info</h1>
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
          <label htmlFor="address" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Address
          </label>
          <div className="col-auto">
            <input name="address" disabled={!updateList.address} type="text" className="win-input" id="address" placeholder="" value={formData.address} onInput={handleInput} />
          </div>
          <div className="col">
            <input name="address" type="checkbox" value={updateList.address} defaultChecked={updateList.address} onChange={handleUlistInput}></input>
            <label htmlFor="address">Update</label>
          </div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="imgpath" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Logo
          </label>
          <div className="col-auto">
            <input type="file" disabled={!updateList.imgpath} name="imgpath" onChange={handleFileChange} accept="image/*" />
          </div>
          <div className="col">
            <input name="imgpath" type="checkbox" value={updateList.imgpath} defaultChecked={updateList.imgpath} onChange={handleUlistInput}></input>
            <label htmlFor="imgpath">Update</label>
          </div>
        </div>
        <div className="row mb-3 align-items-top">
          <h6 className="win-input-hdg">Logo preview</h6>
          <div className="col-auto">{preview != null ? <img src={preview} alt="imgPreview"></img> : " "}</div>
        </div>
        <div className="row mb-3 align-items-top">
          <div className="col-auto">
            <label htmlFor="description" className="mb-2 mb-lg-0">
              Description
            </label>
            <br></br>
            <textarea name="description" disabled={!updateList.description} rows="10" cols="100" className="win-input" id="description" placeholder="" value={formData.description} onInput={handleInput} />
          </div>
          <div className="col">
            <input name="description" type="checkbox" value={updateList.description} defaultChecked={updateList.description} onChange={handleUlistInput}></input>
            <label htmlFor="description">Update</label>
          </div>
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

export default CompanyInfoForm;
