import React, { useEffect } from "react";
import "../../style/home.css";
import { useState, useRef } from "react";
import "../../style/wininput.css";
import "../../style/buttons.css";
import { MdOutlineManageSearch } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
function ContactForm({ contact, onSubmit, onUpdate, onClear, onClose }) {
  const accountModalBtRef = useRef(null);
  const [accArray, setAccArray] = useState([]);
  const [accArrayIdx, setAccArrayIdx] = useState(0);
  const [clr, setClr] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [formTitle, setFormTitle] = useState("New Contact");
  const [formData, setFormData] = useState({
    account: -1,
    title: " ",
    firstname: " ",
    lastname: " ",
    email: " ",
    phone: " ",
    mobile: " ",
    contact_id: -1,
  });
  const [accountsearch, setAccountSearch] = useState(null);
  const [userFound, setUserFound] = useState(true);
  const [contactFound, setContactFound] = useState(true);
  const [accountFound, setAccountFound] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    owner_error: "",
    title_error: "",
  });

  var cfgAccountSearch = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/searchaccountbyname",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {
      account: "",
    },
  };

  useEffect(() => {
    if (contact != null) {
      console.log(contact.title);
      setFormData({
        account: contact.account.id,
        contact: contact.id,
        contact_id: contact.id,
        title: contact.title,
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        phone: contact.phone,
        mobile: contact.mobile,
      });
      setFormTitle("Edit Contact");
      setIsUpdateForm(true);
      setAccountFound(true);
      setAccountSearch(contact.account.name);
    }
  }, []);

  function validate() {
    var temperrors = {
      firstname_error: "",
      lastname_error: "",
      account_error: "",
    };
    var valid = true;

    if (!accountsearch.trim()) {
      temperrors.account_error = "*";
      valid = false;
    }

    if (!formData.firstname.trim()) {
      temperrors.firstname_error = "*";
      valid = false;
    }
    if (!formData.lastname.trim()) {
      temperrors.lastname_error = "*";
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
    if (e.target.name === "account") {
      setAccountSearch(e.target.value);
      if (accountFound == true) {
        setAccountFound(false);
      }
      return;
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleAccountSearch() {
    if (accountsearch !== cfgAccountSearch.data.account && accountFound == false) {
      cfgAccountSearch.data.account = accountsearch;
      axios(cfgAccountSearch)
        .then(function (response) {
          if (response.status === 200) {
            if (response.data.accounts.length == 1) {
              changeAccount(response.data.accounts[0]);
            } else {
              setAccArray(response.data.accounts);
              if (accountModalBtRef.current) {
                accountModalBtRef.current.click();
              }
            }
          }
        })
        .catch(function (error) {
          if (error.status === 404) {
            toast.warning("No accounts found.");
          } else {
            console.log(error);
            toast.error("Error: " + error.message);
          }
        });
    }
  }

  function changeAccount(newAcc) {
    setAccountFound(true);
    setAccountSearch(newAcc.name);
    setFormData({ ...formData, ["account"]: newAcc.id });
  }

  return (
    <div className="win-input-ctrlbg win-input-rb win-input-hlorange win-input-margin win-input-padding">
      <div className="d-flex align-items-center">
        <div>
          <img src={require("../../img/contact-icon-sm.png")} alt="icon"></img>
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
          <label htmlFor="firstname" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            First name
          </label>
          <div className="col-auto">
            <input name="firstname" type="text" className="win-input" id="firstname" placeholder="" value={formData.firstname} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.firstname_error && <p className="win-input-error d-block">{validationErrors.firstname_error}</p>}</div>
        </div>
        <div className="row mb-3 align-items-top">
          <label htmlFor="lastname" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Last name
          </label>
          <div className="col-auto">
            <input name="lastname" type="text" className="win-input" id="lastname" placeholder="" value={formData.lastname} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.lastname_error && <p className="win-input-error d-block">{validationErrors.lastname_error}</p>}</div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="account" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Account
          </label>
          <div className="col-auto">
            <input name="account" type="text" className={accountFound == true ? "win-input win-input-u" : "win-input"} id="account" placeholder="" value={accountsearch} onInput={handleInput} /> &nbsp;
            <button className="btn-win7 btn-ico" type="button" onClick={handleAccountSearch}>
              <MdOutlineManageSearch></MdOutlineManageSearch>
            </button>
            <button ref={accountModalBtRef} type="button" className="invis" data-bs-toggle="modal" data-bs-target="#accountModal"></button>
            <div className="modal fade" id="accountModal" tabindex="-1" aria-labelledby="accountModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="accountModalLabel">
                      Select an account
                    </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <select id="userlist" multiple className="form-control" value={[accArrayIdx]} onChange={(e) => setAccArrayIdx(parseInt(e.target.value, 10))}>
                      {accArray.map((t, i) => (
                        <option key={i} value={i}>
                          {t.id + " " + t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-win7" data-bs-dismiss="modal">
                      Cancel
                    </button>
                    <button type="button" className="btn-win7" data-bs-dismiss="modal" onClick={() => changeAccount(accArray[accArrayIdx])}>
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">{validationErrors.account_error && <p className="win-input-error d-block">{validationErrors.account_error}</p>}</div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="title" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Title
          </label>
          <div className="col-auto">
            <input name="title" type="text" className="win-input" id="title" placeholder="" value={formData.title} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.title_error && <p className="win-input-error d-block">{validationErrors.title_error}</p>}</div>
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
            phone
          </label>
          <div className="col-auto">
            <input name="phone" type="text" className="win-input" id="phone" placeholder="" value={formData.phone} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.phone_error && <p className="win-input-error d-block">{validationErrors.phone_error}</p>}</div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="mobile" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            mobile
          </label>
          <div className="col-auto">
            <input name="mobile" type="text" className="win-input" id="mobile" placeholder="" value={formData.mobile} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.mobile_error && <p className="win-input-error d-block">{validationErrors.mobile_error}</p>}</div>
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

export default ContactForm;
