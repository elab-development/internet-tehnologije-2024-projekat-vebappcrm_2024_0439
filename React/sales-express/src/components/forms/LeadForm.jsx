import React, { useEffect } from "react";
import "../../style/home.css";
import { useState, useRef } from "react";
import "../../style/wininput.css";
import "../../style/buttons.css";
import { MdOutlineManageSearch } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
function LeadForm({ lead, onSubmit, onUpdate, onClear, onClose }) {
  var cfgSearchUser = {
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

  var cfgGetStatuses = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/leadstatuses",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  const btref = useRef(null);
  const [usrArray, setUsrArray] = useState([]);
  const [arrayidx, setArrayidx] = useState(0);
  const [clr, setClr] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [formTitle, setFormTitle] = useState("New Lead");
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    company: "",
    owner: "" + window.sessionStorage.getItem("CURRENT_USER_ID"),
    title: "",
    description: " ",
    phone: " ",
    email: " ",
    status: 1,
    lead_id: -1,
  });
  const [ownersearch, setOwnerSearch] = useState(window.sessionStorage.getItem("CURRENT_USER_NAME"));
  const [userFound, setUserFound] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    name_error: "",
    lastname_error: "",
    company_error: "",
    owner_error: "",
    title_error: "",
  });
  const [ldStats, setLdStats] = useState(null);

  useEffect(() => {
    console.log(lead);
    if (lead != null) {
      setFormData({
        name: lead.name,
        lastname: lead.lastname,
        company: lead.company,
        owner: lead.owner.id,
        title: lead.title,
        description: lead.description,
        phone: lead.phone,
        email: lead.email,
        status: lead.status.id,
        lead_id: lead.id,
      });
      setFormTitle("Edit Lead");
      setIsUpdateForm(true);
      setOwnerSearch(lead.owner.name + " " + lead.owner.lastname);
      setUserFound(true);
    }
    axios(cfgGetStatuses)
      .then(function (response) {
        if (response.status === 200) {
          setLdStats(response.data.leadstatuses);
          console.log(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }, []);

  function validate() {
    var temperrors = {
      name_error: "",
      lastname_error: "",
      company_error: "",
      title_error: "",
    };
    var valid = true;
    if (!formData.name.trim()) {
      temperrors.name_error = "*";
      valid = false;
    }

    if (!formData.lastname.trim()) {
      temperrors.lastname_error = "*";
      valid = false;
    }

    if (!formData.company.trim()) {
      temperrors.company_error = "*";
      valid = false;
    }

    if (!ownersearch.trim()) {
      temperrors.owner_error = "*";
      valid = false;
    }

    if (!formData.title.trim()) {
      temperrors.title_error = "*";
      valid = false;
    }

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
    if (e.target.name != "owner") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    } else {
      setOwnerSearch(e.target.value);
      if (userFound == true) {
        setUserFound(false);
      }
    }
  }

  function handleSearch() {
    console.log(ownersearch);
    if (ownersearch !== cfgSearchUser.data.user) {
      cfgSearchUser.data.user = ownersearch;
      axios(cfgSearchUser)
        .then(function (response) {
          if (response.status === 200) {
            if (response.data.users.length == 1) {
              setUserFound(true);
              setFormData({ ...formData, ["owner"]: response.data.users[0].id });
              setOwnerSearch(response.data.users[0].name + " " + response.data.users[0].lastname);
            } else {
              console.log(response.data.users);
              setUsrArray(response.data.users);
              if (btref.current) {
                btref.current.click();
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

  return (
    <div className="win-input-ctrlbg win-input-rb win-input-hlorange win-input-margin win-input-padding">
      <div className="d-flex align-items-center">
        <div>
          <img src={require("../../img/lead-icon-sm.png")} alt="icon"></img>
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
            Lead owner
          </label>
          <div className="col-auto">
            <input name="owner" type="text" className={userFound == true ? "win-input win-input-u" : "win-input"} id="owner" placeholder="" value={ownersearch} onInput={handleInput} /> &nbsp;
            <button className="btn-win7 btn-ico" type="button" onClick={handleSearch}>
              <MdOutlineManageSearch></MdOutlineManageSearch>
            </button>
            <button ref={btref} type="button" className="invis" data-bs-toggle="modal" data-bs-target="#usersModal"></button>
            <div className="modal fade" id="usersModal" tabindex="-1" aria-labelledby="usersModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="usersModalLabel">
                      Select a user
                    </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <select id="userlist" multiple className="form-control" value={[arrayidx]} onChange={(e) => setArrayidx(parseInt(e.target.value, 10))}>
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
                    <button type="button" className="btn-win7" data-bs-dismiss="modal" onClick={() => changeUser(usrArray[arrayidx])}>
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">{validationErrors.owner_error && <p className="win-input-error d-block">{validationErrors.owner_error}</p>}</div>
        </div>

        <br></br>
        <div className="row mb-3 align-items-baseline">
          <label htmlFor="status" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Status
          </label>
          <div className="col-auto">
            {ldStats !== null ? (
              <select id="status" onChange={handleInput} className="win-input" name="status" value={formData.status}>
                {ldStats.map((t, i) => (
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
        <br></br>

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
          <label htmlFor="lastname" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Last name
          </label>
          <div className="col-auto">
            <input name="lastname" type="text" className="win-input" id="name" placeholder="" value={formData.lastname} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.lastname_error && <p className="win-input-error d-block">{validationErrors.lastname_error}</p>}</div>
        </div>

        <div className="row mb-3 align-items-top">
          <label htmlFor="company" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Company
          </label>
          <div className="col-auto">
            <input name="company" type="text" className="win-input" id="name" placeholder="" value={formData.company} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.company_error && <p className="win-input-error d-block">{validationErrors.company_error}</p>}</div>
        </div>
        <div className="row mb-3 align-items-top">
          <label htmlFor="email" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            E-mail
          </label>
          <div className="col-auto">
            <input name="email" type="text" className="win-input" id="name" placeholder="" value={formData.email} onInput={handleInput} />
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
          <label htmlFor="title" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Title
          </label>
          <div className="col-auto">
            <input name="title" type="text" className="win-input" id="title" placeholder="" value={formData.title} onInput={handleInput} />
          </div>
          <div className="col">{validationErrors.title_error && <p className="win-input-error d-block">{validationErrors.title_error}</p>}</div>
        </div>
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

export default LeadForm;
