import React from "react";
import "../../style/home.css";
import "../../style/wininput.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
import LeadForm from "../forms/LeadForm.jsx";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Paginator from "../controls/Paginator.jsx";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import ActivityForm from "../forms/ActivityForm.jsx";
import moment from "moment";
function OneLeadPage() {
  const leadParams = useParams();
  const [lead, setLead] = useState(null);
  const [page, setPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [maxPages, setMaxPages] = useState(1);
  const [activities, setActivities] = useState(null);
  const [dispActivities, setDispActivities] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(1);
  const [currActivity, setCurrActivity] = useState(null);
  const [showActForm, setShowActForm] = useState(false);
  const [actFormKey, setActFormKey] = useState(1);
  const navigate = useNavigate();

  var cfgGetLead = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/lead/" + leadParams.lead_id,
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  var cfgUpdateAct = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updateactivity",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteAct = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deleteactivity",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };
  var cfgNewAct = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/newactivity",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  var cfgUpdateLead = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updatelead",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteLead = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deletelead/" + leadParams.lead_id,
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  var cfgConvertLead = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/convertlead",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {
      lead_id: leadParams.lead_id,
    },
  };

  // PAGE LOAD
  useEffect(() => {
    if (lead === null) {
      console.log(leadParams);
      cfgGetLead.url = "http://127.0.0.1:8000/api/lead/" + leadParams.lead_id;
      console.log(cfgGetLead.url);
      axios(cfgGetLead)
        .then(function (response) {
          if (response.status === 200) {
            console.log(response);
            setLead(response.data.lead);
            if (response.data.lead.activities !== undefined) {
              setActivities(response.data.lead.activities);
              setMaxPages(response.data.lead.activities.length / elementsPerPage);
              setDispActivities(response.data.lead.activities.slice(0, elementsPerPage));
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Error: " + error.message);
        });
    }
  }, []);

  // LEAD FORM
  function submitLdFormUpdate(data) {
    cfgUpdateLead.data = data;
    axios(cfgUpdateLead)
      .then(function (response) {
        if (response.status === 200) {
          //refreshLeads();
          toast.success("Successfully updated lead.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // ACTIVITY FORM
  function submitActForm(data) {
    cfgNewAct.data = data;
    axios(cfgNewAct)
      .then(function (response) {
        if (response.status === 200) {
          refreshActivities();
          toast.info("Successfully created activity.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  function submitActFormUpdate(data) {
    cfgUpdateAct.data = data;
    axios(cfgUpdateAct)
      .then(function (response) {
        if (response.status === 200) {
          refreshActivities();
          toast.success("Successfully updated activity.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // ACTIVITY TABLE
  function setTable(startindex, endindex) {
    setDispActivities(activities.slice(startindex, endindex));
  }

  function refreshActivities() {
    axios(cfgGetLead)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.lead.activities !== undefined) {
            setActivities(response.data.lead.activities);
            setMaxPages(response.data.lead.activities.length / elementsPerPage);
            setDispActivities(response.data.lead.activities.slice(0, elementsPerPage));
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  function np() {
    if (page + 1 < maxPages) {
      setPage(page + 1);
      setTable(page * elementsPerPage, page * elementsPerPage + elementsPerPage);
    }
  }

  function pp() {
    if (page - 1 > 0) {
      setPage(page - 1);
      setTable(page * elementsPerPage, page * elementsPerPage + elementsPerPage);
    }
  }

  function gotopg(pg) {
    setPage(pg - 1);
    setTable((pg - 1) * elementsPerPage, (pg - 1) * elementsPerPage + elementsPerPage);
  }

  // LEAD FORM CONTROL
  function showupdateldform() {
    closeldform();
    clearldform(true);
    setShowForm(true);
  }

  function clearldform(x) {
    if (x == true) {
      setFormKey(Math.random() * 10);
    }
  }

  function closeldform() {
    setCurrActivity(null);
    setShowForm(false);
  }

  function showdeleteldtoast() {
    toast.warning("Are you sure you want to delete the lead?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteLead(),
      },
      duration: Infinity,
    });
  }

  function showconverttoast() {
    toast.info("Are you sure you want to convert the lead?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => convertLead(),
      },
      duration: Infinity,
    });
  }
  function deleteLead() {
    axios(cfgDeleteLead)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted lead.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  function convertLead() {
    axios(cfgConvertLead)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully converted lead.");
          navigate("/opportunities/");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // ACTIVITY FORM CONTROL

  function showdeleteacttoast(i) {
    toast.warning("Are you sure you want to delete the activity?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteActivity(i),
      },
      duration: Infinity,
    });
  }

  function showupdateactform(i) {
    closeactform();
    clearactform(true);
    setCurrActivity(activities[i]);
    setShowActForm(true);
  }

  function shownewactform() {
    closeactform();
    clearactform(true);
    setCurrActivity(null);
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

  function deleteActivity(i) {
    cfgDeleteAct.url = "http://127.0.0.1:8000/api/deleteactivity/" + lead.activities[i].id;
    axios(cfgDeleteAct)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted activity.");
          refreshActivities();
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
  if (lead !== null) {
    return (
      <div>
        <Header></Header>
        <NavMenu></NavMenu>
        <div className="overflow-hidden">
          <div className="row">
            <div className="col-lg-1 sidecol">
              <a href="/leads">
                <span>
                  <FaArrowLeft />
                </span>
                &nbsp; Back to leads
              </a>
            </div>
            <div className="col-lg gx-0 gy-0">
              {showForm && <LeadForm key={formKey} lead={lead} onUpdate={submitLdFormUpdate} onClear={clearldform} onClose={closeldform}></LeadForm>}
              {showActForm && <ActivityForm key={actFormKey} activity={currActivity} lead={lead} onSubmit={submitActForm} onUpdate={submitActFormUpdate} onClear={clearactform} onClose={closeactform}></ActivityForm>}
              <div>
                <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                  <div>
                    <h5 className="pagegrouphdg win-input-hdgpadding">Lead info</h5>
                    <h6 className="pagegrouphdg win-input-hdgpadding">{lead.title}</h6>
                  </div>
                  <div>
                    <button type="button" className="btn-win7" onClick={() => showupdateldform()}>
                      Edit
                    </button>
                    &nbsp;
                    <button type="button" className="btn-win7" onClick={() => showdeleteldtoast()}>
                      Delete
                    </button>
                    &nbsp;
                    <button type="button" className="btn-win7" onClick={() => showconverttoast()}>
                      Convert
                    </button>
                  </div>
                  <br></br>
                  <div className="">
                    <table className="tble">
                      <tbody>
                        <tr>
                          <td>Owner: </td>
                          <td>{lead.owner.name + " " + lead.owner.lastname}</td>
                        </tr>
                        <tr>
                          <td>Status: </td>
                          <td>{lead.status.name}</td>
                        </tr>
                        <tr>
                          <td>Name: </td>
                          <td>{lead.name}</td>
                        </tr>
                        <tr>
                          <td>Last name: </td>
                          <td>{lead.lastname}</td>
                        </tr>
                        <tr>
                          <td>Company: </td>
                          <td>{lead.company}</td>
                        </tr>
                        <tr>
                          <td>Phone: </td>
                          <td>{lead.phone}</td>
                        </tr>
                        <tr>
                          <td>E-mail: </td>
                          <td>{lead.email}</td>
                        </tr>
                        <tr>
                          <td>Description: </td>
                        </tr>
                      </tbody>
                    </table>
                    <textarea name="description" disabled rows="10" cols="100" className="win-input" id="description" value={lead.description} />
                  </div>
                </div>
                <br></br>
                <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                  <h6 className="pagegrouphdg win-input-hdgpadding">Lead activities</h6>
                  <br></br>
                  <button type="button" className="btn-win7" onClick={() => shownewactform()}>
                    New
                  </button>
                  <br></br>
                  <div className="tableview">
                    {activities.length === 0 ? (
                      <h5 style={{ color: "grey" }}>No activities to show.</h5>
                    ) : (
                      <table className="tble w-100">
                        <thead>
                          <tr>
                            <th>Action</th>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Assigned to</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dispActivities.map((t, i) => (
                            <tr key={i}>
                              <td>
                                <a href="#" style={{ color: "black" }} onClick={() => showupdateactform(i)}>
                                  Edit
                                </a>
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <a href="#" style={{ color: "black" }} onClick={() => showdeleteacttoast(i)}>
                                  Delete
                                </a>
                              </td>
                              <td>#{t.id}</td>
                              <td>
                                <a href={"/activity/" + t.id} style={{ color: "black" }}>
                                  {t.title}
                                </a>
                              </td>
                              <td>{t.assigned_to.name + " " + t.assigned_to.lastname}</td>
                              <td>{moment(t.date).format("DD. MM. YYYY.")}</td>
                              <td>{decodeStatus(t.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    <Paginator onChange={gotopg} onPrevious={pp} onNext={np} pageCount={maxPages} active={page}></Paginator>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    <div className="container">
      <h1 style={{ color: "grey" }}>No lead found</h1>
    </div>;
  }
}

export default OneLeadPage;
