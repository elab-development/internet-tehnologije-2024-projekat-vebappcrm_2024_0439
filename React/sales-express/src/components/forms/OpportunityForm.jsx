import React, { useEffect } from "react";
import "../../style/home.css";
import { useState, useRef } from "react";
import "../../style/wininput.css";
import "../../style/buttons.css";
import { MdOutlineManageSearch } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
function OpportunityForm({ opportunity, onSubmit, onUpdate, onClear, onClose }) {
  const userModalBtRef = useRef(null);
  const contactModalBtRef = useRef(null);
  const accountModalBtRef = useRef(null);

  const [usrArray, setUsrArray] = useState([]);
  const [usrArrayIdx, setUsrArrayIdx] = useState(0);
  const [ctArray, setCtArray] = useState([]);
  const [ctArrayIdx, setCtArrayIdx] = useState(0);
  const [accArray, setAccArray] = useState([]);
  const [accArrayIdx, setAccArrayIdx] = useState(0);
  const [clr, setClr] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [formTitle, setFormTitle] = useState("New Opportunity");
  const [formData, setFormData] = useState({
    contact: -1,
    account: -1,
    owner: "" + window.sessionStorage.getItem("CURRENT_USER_ID"),
    title: "",
    description: "",
    status: 1,
    opportunity_id: -1,
  });
  const [ownersearch, setOwnerSearch] = useState(window.sessionStorage.getItem("CURRENT_USER_NAME"));
  const [contactsearch, setContactSearch] = useState(opportunity.contact.firstname + " " + opportunity.contact.lastname);
  const [accountsearch, setAccountSearch] = useState(opportunity.account.name);
  const [userFound, setUserFound] = useState(true);
  const [contactFound, setContactFound] = useState(true);
  const [accountFound, setAccountFound] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    owner_error: "",
    title_error: "",
  });
  const [opStats, setOpStats] = useState(null);

  var cfgUserSearch = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/searchuserbyname",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {
      user: window.sessionStorage.getItem("CURRENT_USER_NAME"),
    },
  };

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

  var cfgContactSearch = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/searchcontactbyname",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {
      contact: "",
    },
  };

  var cfgGetStatuses = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/opportunitystatuses",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  useEffect(() => {
    console.log("OPPORTUNITY:", opportunity);
    if (opportunity != null) {
      console.log(opportunity.title);
      setFormData({
        owner: opportunity.owner.id,
        title: "" + opportunity.title,
        description: "" + opportunity.description,
        account: opportunity.account.id,
        contact: opportunity.contact.id,
        opportunity_id: opportunity.id,
        status: opportunity.status.id,
      });
      setFormTitle("Edit Opportunity");
      setIsUpdateForm(true);
      setUserFound(true);
      setAccountFound(true);
      setContactFound(true);
      setOwnerSearch(opportunity.owner.name + " " + opportunity.owner.lastname);
      setContactSearch(opportunity.contact.firstname + " " + opportunity.contact.lastname);
      setAccountSearch(opportunity.account.name);
    }
    axios(cfgGetStatuses)
      .then(function (response) {
        if (response.status === 200) {
          setOpStats(response.data.opportunitystatuses);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }, []);

  function validate() {
    var temperrors = {
      title_error: "",
      contact_error: "",
      account_error: "",
    };
    var valid = true;

    if (!ownersearch.trim()) {
      temperrors.owner_error = "*";
      valid = false;
    }

    if (!contactsearch.trim()) {
      temperrors.contact_error = "*";
      valid = false;
    }

    if (!accountsearch.trim()) {
      temperrors.account_error = "*";
      valid = false;
    }

    if (!formData.title.trim()) {
      temperrors.title_error = "*";
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
    if (e.target.name === "owner") {
      setOwnerSearch(e.target.value);
      if (userFound == true) {
        setUserFound(false);
      }
      return;
    }
    if (e.target.name === "account") {
      setAccountSearch(e.target.value);
      if (accountFound == true) {
        setAccountFound(false);
      }
      return;
    }
    if (e.target.name === "contact") {
      setContactSearch(e.target.value);
      if (contactFound == true) {
        setContactFound(false);
      }
      return;
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleUserSearch() {
    if (ownersearch !== cfgUserSearch.data.user && userFound == false) {
      cfgUserSearch.data.user = ownersearch;
      axios(cfgUserSearch)
        .then(function (response) {
          if (response.status === 200) {
            if (response.data.users.length == 1) {
              setUserFound(true);
              setFormData({ ...formData, ["owner"]: response.data.users[0].id });
              setOwnerSearch(response.data.users[0].name + " " + response.data.users[0].lastname);
            } else {
              setUsrArray(response.data.users);
              if (userModalBtRef.current) {
                userModalBtRef.current.click();
              }
            }
          }
        })
        .catch(function (error) {
          if (error.status === 404) {
            toast.warning("No users found.");
          } else {
            console.log(error);
            toast.error("Error: " + error.message);
          }
        });
    }
  }

  function changeUser(newUser) {
    setUserFound(true);
    setOwnerSearch(newUser.name + " " + newUser.lastname);
    setFormData({ ...formData, ["owner"]: newUser.id });
  }

  function handleContactSearch() {
    if (contactsearch !== cfgContactSearch.data.contact && contactFound == false) {
      cfgContactSearch.data.contact = contactsearch;
      if (accountFound == true) {
        cfgContactSearch.data.account = formData.account;
      }
      axios(cfgContactSearch)
        .then(function (response) {
          if (response.status === 200) {
            if (response.data.contacts.length == 1) {
              changeContact(response.data.contacts[0]);
            } else {
              setCtArray(response.data.contacts);
              if (contactModalBtRef.current) {
                contactModalBtRef.current.click();
              }
            }
          }
        })
        .catch(function (error) {
          if (error.status === 404) {
            toast.warning("No contacts found.");
          } else {
            console.log(error);
            toast.error("Error: " + error.message);
          }
        });
    }
  }

  function changeContact(newContact) {
    setContactFound(true);

    setContactSearch(newContact.firstname + " " + newContact.lastname);
    setFormData({ ...formData, ["contact"]: newContact.id });
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
            toast.warning("No users found.");
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
          <img src={require("../../img/opportunity-icon-sm.png")} alt="icon"></img>
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
          <label htmlFor="owner" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Opportunity owner
          </label>
          <div className="col-auto">
            <input name="owner" type="text" className={userFound == true ? "win-input win-input-u" : "win-input"} id="owner" placeholder="" value={ownersearch} onInput={handleInput} /> &nbsp;
            <button className="btn-win7 btn-ico" type="button" onClick={handleUserSearch}>
              <MdOutlineManageSearch></MdOutlineManageSearch>
            </button>
            <button ref={userModalBtRef} type="button" className="invis" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Select a user
                    </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <select id="userlist" multiple className="form-control" value={[usrArrayIdx]} onChange={(e) => setUsrArrayIdx(parseInt(e.target.value, 10))}>
                      {usrArray.map((t, i) => (
                        <option key={i} value={i}>
                          {t.id + " " + t.name + " " + t.lastname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-win7" data-bs-dismiss="modal">
                      Cancel
                    </button>
                    <button type="button" className="btn-win7" data-bs-dismiss="modal" onClick={() => changeUser(usrArray[usrArrayIdx])}>
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">{validationErrors.owner_error && <p className="win-input-error d-block">{validationErrors.owner_error}</p>}</div>
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
        <br></br>
        <div className="row mb-3 align-items-top">
          <label htmlFor="status" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Status
          </label>
          <div className="col-auto">
            {opStats !== null ? (
              <select id="status" onChange={handleInput} className="win-input" name="status" value={formData.status}>
                {opStats.map((t, i) => (
                  <option key={i} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              " "
            )}
          </div>
          <div className="col"></div>
        </div>
        <div className="row mb-3 align-items-top">
          <label htmlFor="contact" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Contact
          </label>
          <div className="col-auto">
            <input name="contact" type="text" className={contactFound == true ? "win-input win-input-u" : "win-input"} id="contact" placeholder="" value={contactsearch} onInput={handleInput} /> &nbsp;
            <button className="btn-win7 btn-ico" type="button" onClick={handleContactSearch}>
              <MdOutlineManageSearch></MdOutlineManageSearch>
            </button>
            <button ref={contactModalBtRef} type="button" className="invis" data-bs-toggle="modal" data-bs-target="#contactModal"></button>
            <div className="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="contactModalLabel">
                      Select a contact
                    </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <select id="userlist" multiple className="form-control" value={[ctArrayIdx]} onChange={(e) => setCtArrayIdx(parseInt(e.target.value, 10))}>
                      {ctArray.map((t, i) => (
                        <option key={i} value={i}>
                          {t.id + " " + t.firstname + " " + t.lastname + " (" + t.account.name + ")"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-win7" data-bs-dismiss="modal">
                      Cancel
                    </button>
                    <button type="button" className="btn-win7" data-bs-dismiss="modal" onClick={() => changeContact(ctArray[ctArrayIdx])}>
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">{validationErrors.contact_error && <p className="win-input-error d-block">{validationErrors.contact_error}</p>}</div>
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

        <br></br>
        <div className="form-group row mb-3 align-items-top">
          <div className="col-auto">
            <label htmlFor="description" className="mb-2 mb-lg-0">
              Description
            </label>
            <br></br>

            <textarea name="description" rows="10" cols="100" className="win-input" id="description" placeholder="" value={formData.description} onInput={handleInput} />
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

export default OpportunityForm;
