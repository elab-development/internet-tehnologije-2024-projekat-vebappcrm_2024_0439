import React from "react";
import "../../style/home.css";
import "../../style/wininput.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import ActivityForm from "../forms/ActivityForm.jsx";
import moment from "moment";
function OneActivityPage() {
  const activity_id = useParams();
  const [activity, setActivity] = useState(null);
  const [owningID, setOwningID] = useState(null);
  const [currActivity, setCurrActivity] = useState(null);
  const [showActForm, setShowActForm] = useState(false);
  const [actFormKey, setActFormKey] = useState(1);
  const navigate = useNavigate();

  var cfgGetActivity = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/activity/" + activity_id.activity_id,
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  var cfgUpdateActivity = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updateactivity",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteActivity = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deleteactivity",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  // PAGE LOAD
  useEffect(() => {
    if (activity === null) {
      refreshActivityData();
    }
  }, []);

  function submitActFormUpdate(data) {
    cfgUpdateActivity.data = data;
    axios(cfgUpdateActivity)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully updated activity.");
          refreshActivityData();
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // ACTIVITY DATA
  function refreshActivityData() {
    cfgGetActivity.url = "http://127.0.0.1:8000/api/activity/" + activity_id.activity_id;
    console.log(cfgGetActivity.url);
    axios(cfgGetActivity)
      .then(function (response) {
        if (response.status === 200) {
          setActivity(response.data.activity);
          if (response.data.activity.owning_lead !== null) {
            setOwningID(response.data.activity.owning_lead.id);
          } else if (response.data.activity.owning_opportunity !== null) {
            setOwningID(response.data.activity.owning_opportunity.id);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // ACTIVITY FORM CONTROL
  function showdeleteacttoast() {
    toast.warning("Are you sure you want to delete the activity?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteActivity(),
      },
      duration: Infinity,
    });
  }

  function showupdateactform() {
    closeactform();
    clearactform(true);
    setShowActForm(true);
  }
  function clearactform(x) {
    if (x == true) {
      setActFormKey(Math.random() * 10);
    }
  }

  function closeactform() {
    setCurrActivity(null);
    setShowActForm(false);
  }

  function deleteActivity() {
    cfgDeleteActivity.url = "http://127.0.0.1:8000/api/deleteactivity/" + activity.id;
    axios(cfgDeleteActivity)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted activity.");
          if (activity.owning_lead != null) {
            navigate("/lead/" + owningID);
          } else if (activity.owning_opportunity != null) {
            navigate("/opportunity/" + owningID);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // STATUS UTILITY

  function decodeStatus(x) {
    switch (x) {
      case 0:
        return "New";
      case 1:
        return "Working";
      case 2:
        return "Closed";
    }
  }

  // MAIN VIEW
  if (activity !== null) {
    return (
      <div>
        <Header></Header>
        <NavMenu></NavMenu>
        <div className="overflow-hidden">
          <div className="row">
            <div className="col-lg-1 sidecol">
              <a href={activity.owning_lead != null ? "/lead/" + owningID : "/opportunity/" + owningID}>
                <span>
                  <FaArrowLeft />
                </span>
                &nbsp; Back
              </a>
            </div>
            <div className="col-lg gx-0 gy-0">
              {showActForm && <ActivityForm key={actFormKey} activity={activity} lead={activity.owning_lead} opportunity={activity.owning_opportunity} onUpdate={submitActFormUpdate} onClear={clearactform} onClose={closeactform}></ActivityForm>}
              <div>
                <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                  <div>
                    <h5 className="pagegrouphdg win-input-hdgpadding">Activity info</h5>
                    <h6 className="pagegrouphdg win-input-hdgpadding">{activity.title}</h6>
                  </div>
                  <div>
                    <button type="button" className="btn-win7" onClick={() => showupdateactform()}>
                      Edit
                    </button>
                    &nbsp;
                    <button type="button" className="btn-win7" onClick={() => showdeleteacttoast()}>
                      Delete
                    </button>
                  </div>
                  <br></br>
                  <div className="">
                    <table className="tble">
                      <tbody>
                        <tr>
                          <td>Assigned to: </td>
                          <td>{activity.assigned_to.name + " " + activity.assigned_to.lastname}</td>
                        </tr>
                        <tr>
                          <td>Status: </td>
                          <td>{decodeStatus(activity.status)}</td>
                        </tr>
                        <tr>
                          <td>Date: </td>
                          <td>{moment(activity.date).format("DD. MM. YYYY.")}</td>
                        </tr>
                        <tr>
                          <td>Description: </td>
                        </tr>
                      </tbody>
                    </table>
                    <textarea name="description" disabled rows="10" cols="100" className="win-input" id="description" value={activity.description} />
                  </div>
                </div>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    <div className="container">
      <h1 style={{ color: "grey" }}>No activity found</h1>
    </div>;
  }
}

export default OneActivityPage;
