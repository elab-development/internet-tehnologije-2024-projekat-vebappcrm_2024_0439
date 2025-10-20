import React, { useEffect } from "react";
import "../../style/home.css";
import { useState, useRef } from "react";
import "../../style/wininput.css";
import "../../style/buttons.css";
import { MdOutlineManageSearch } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
import moment from "moment";
function ActivityForm({ activity, lead, opportunity, onSubmit, onUpdate, onClear, onClose }) {
  var config = {
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

  const btref = useRef(null);
  const [usrArray, setUsrArray] = useState([]);
  const [arrayidx, setArrayidx] = useState(0);
  const [clr, setClr] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const today = moment().format("YYYY-MM-DD");
  const [formData, setFormData] = useState({
    title: "",
    date: today,
    status: 0,
    assigned_to: "" + window.sessionStorage.getItem("CURRENT_USER_ID"),
    description: "",
    activity_id: -1,
  });
  const [ownersearch, setOwnerSearch] = useState(window.sessionStorage.getItem("CURRENT_USER_NAME"));
  const [userFound, setUserFound] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    owner_error: "",
    title_error: "",
    date_error: "",
  });

  useEffect(() => {
    console.log(activity);
    if (activity != null) {
      setFormData({
        title: activity.title,
        date: activity.date,
        status: activity.status,
        assigned_to: activity.assigned_to.id,
        description: activity.description,
        activity_id: activity.id,
      });
      setIsUpdateForm(true);
      setOwnerSearch(activity.assigned_to.name + " " + activity.assigned_to.lastname);
      setUserFound(true);
    }
    if (lead != null) {
      setFormData((fd) => ({ ...fd, owninglead: lead.id }));
    }
    if (opportunity != null) {
      setFormData((fd) => ({ ...fd, owningopportunity: opportunity.id }));
    }
  }, []);

  function validate() {
    var temperrors = {
      owner_error: "",
      title_error: "",
      date_error: "",
    };
    var valid = true;

    if (!ownersearch.trim()) {
      temperrors.owner_error = "*";
      valid = false;
    }

    if (!formData.title.trim()) {
      temperrors.title_error = "*";
      valid = false;
    }

    if (!formData.date.trim()) {
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
    if (ownersearch !== config.data.user) {
      config.data.user = ownersearch;
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            if (response.data.users.length == 1) {
              setUserFound(true);
              setFormData({ ...formData, ["assigned_to"]: response.data.users[0].id });
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
    setFormData({ ...formData, ["assigned_to"]: newUser.id });
  }

  return (
    <div className="win-input-ctrlbg win-input-rb win-input-hlorange win-input-margin win-input-padding">
      <div className="d-flex align-items-center">
        <div>
          <img src={require("../../img/task-icon-sm.png")} alt="icon"></img>
        </div>
        <div>
          <h1 className="win-hdg">&nbsp;&nbsp;&nbsp;&nbsp;New Lead Activity</h1>
        </div>
      </div>
      <br />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="row mb-3 align-items-top">
          <label htmlFor="owner" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Activity owner
          </label>
          <div className="col-auto">
            <input name="owner" type="text" className={userFound == true ? "win-input win-input-u" : "win-input"} id="owner" placeholder="" value={ownersearch} onInput={handleInput} /> &nbsp;
            <button className="btn-win7 btn-ico" type="button" onClick={handleSearch}>
              <MdOutlineManageSearch></MdOutlineManageSearch>
            </button>
            <button ref={btref} type="button" className="invis" data-bs-toggle="modal" data-bs-target="#activityUsersModal"></button>
            <div className="modal fade" id="activityUsersModal" tabindex="-1" aria-labelledby="activityUsersModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="activityUsersModalLabel">
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
          <label htmlFor="date" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Date
          </label>
          <div className="col-auto">
            <input id="date" onChange={handleInput} className="win-input" type="date" name="date" value={formData.date} />
          </div>
          <div className="col">{validationErrors.date_error && <p className="win-input-error d-block">{validationErrors.date_error}</p>}</div>
        </div>
        <div className="row mb-3 align-items-top">
          <label htmlFor="status" className="win-input-label col-lg-auto col-md-12 col-form-label mb-2 mb-lg-0">
            Status
          </label>
          <div className="col-auto">
            <select id="status" onChange={handleInput} className="win-input" name="status" value={formData.status}>
              <option value="0">New</option>
              <option value="1">Working</option>
              <option value="2">Closed</option>
            </select>
          </div>
          <div className="col"></div>
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

export default ActivityForm;
