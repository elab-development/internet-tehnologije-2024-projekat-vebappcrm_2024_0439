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
import OpportunityForm from "../forms/OpportunityForm.jsx";
function OneOpportunityPage() {
  const optParams = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [page, setPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [maxPages, setMaxPages] = useState(1);
  const [activities, setActivities] = useState(null);
  const [dispActivities, setDispActivities] = useState(null);
  const [showOpForm, setShowOpForm] = useState(false);
  const [opFormKey, setOpFormKey] = useState(1);
  const [currActivity, setCurrActivity] = useState(null);
  const [showActForm, setShowActForm] = useState(false);
  const [actFormKey, setActFormKey] = useState(1);
  const navigate = useNavigate();

  var cfgGetOpt = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/opportunity/" + optParams.opportunity_id,
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

  var cfgUpdateOpt = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updateopportunity",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteOpt = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deleteopportunity/" + optParams.opportunity_id,
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  // PAGE LOAD
  useEffect(() => {
    if (opportunity === null) {
      cfgGetOpt.url = "http://127.0.0.1:8000/api/opportunity/" + optParams.opportunity_id;
      axios(cfgGetOpt)
        .then(function (response) {
          if (response.status === 200) {
            console.log(response.data.opportunity.activities);
            setOpportunity(response.data.opportunity);
            if (response.data.opportunity.activities !== undefined) {
              setActivities(response.data.opportunity.activities);
              setMaxPages(response.data.opportunity.activities.length / elementsPerPage);
              setDispActivities(response.data.opportunity.activities.slice(0, elementsPerPage));
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Error: " + error.message);
        });
    }
  }, []);

  // OPPORTUNITY FORM
  function submitOpFormUpdate(data) {
    cfgUpdateOpt.data = data;
    axios(cfgUpdateOpt)
      .then(function (response) {
        if (response.status === 200) {
          //refreshLeads();
          toast.success("Successfully updated opportunity.");
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
    axios(cfgGetOpt)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.opportunity.activities !== undefined) {
            setActivities(response.data.opportunity.activities);
            setMaxPages(response.data.opportunity.activities.length / elementsPerPage);
            setDispActivities(response.data.opportunity.activities.slice(0, elementsPerPage));
            console.log(response.data.activities);
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
  function showupdateopform() {
    closeopform();
    clearopform(true);
    setShowOpForm(true);
  }

  function clearopform(x) {
    if (x == true) {
      setOpFormKey(Math.random() * 10);
    }
  }

  function closeopform() {
    setCurrActivity(null);
    setShowOpForm(false);
  }

  function showdeleteoptoast() {
    toast.warning("Are you sure you want to delete the opportunity?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteOpportunity(),
      },
      duration: Infinity,
    });
  }

  function deleteOpportunity() {
    axios(cfgDeleteOpt)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted opportunity.");
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
    cfgDeleteAct.url = "http://127.0.0.1:8000/api/deleteactivity/" + opportunity.activities[i].id;
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
  if (opportunity !== null) {
    return (
      <div>
        <Header></Header>
        <NavMenu></NavMenu>
        <div className="overflow-hidden">
          <div className="row">
            <div className="col-lg-1 sidecol">
              <a href="/opportunities">
                <span>
                  <FaArrowLeft />
                </span>
                &nbsp; Back to opportunities
              </a>
            </div>
            <div className="col-lg gx-0 gy-0">
              {showOpForm && <OpportunityForm key={opFormKey} opportunity={opportunity} onUpdate={submitOpFormUpdate} onClear={clearopform} onClose={closeopform}></OpportunityForm>}
              {showActForm && <ActivityForm key={actFormKey} activity={currActivity} opportunity={opportunity} onSubmit={submitActForm} onUpdate={submitActFormUpdate} onClear={clearactform} onClose={closeactform}></ActivityForm>}
              <div>
                <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                  <div>
                    <h5 className="pagegrouphdg win-input-hdgpadding">Opportunity info</h5>
                    <h6 className="pagegrouphdg win-input-hdgpadding">{opportunity.title}</h6>
                  </div>
                  <div>
                    <button type="button" className="btn-win7" onClick={() => showupdateopform()}>
                      Edit
                    </button>
                    &nbsp;
                    <button type="button" className="btn-win7" onClick={() => showdeleteoptoast()}>
                      Delete
                    </button>
                  </div>
                  <br></br>
                  <div className="">
                    <table className="tble">
                      <tbody>
                        <tr>
                          <td>Owner: </td>
                          <td>{opportunity.owner.name + " " + opportunity.owner.lastname}</td>
                        </tr>
                        <tr>
                          <td>Status: </td>
                          <td>{opportunity.status.name}</td>
                        </tr>
                        <tr>
                          <td>Description: </td>
                        </tr>
                      </tbody>
                    </table>
                    <textarea name="description" disabled rows="10" cols="100" className="win-input" id="description" value={opportunity.description} />
                  </div>
                </div>
                <br></br>
                <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                  <h6 className="pagegrouphdg win-input-hdgpadding">Contact data</h6>
                  <table className="tble win-input-hdgpadding">
                    <tbody>
                      <tr>
                        <td>Name: </td>
                        <td>
                          <a href={"/contact/" + opportunity.contact.id}>{opportunity.contact.firstname + " " + opportunity.contact.lastname}</a>
                        </td>
                      </tr>
                      <tr>
                        <td>E-mail: </td>
                        <td>{opportunity.contact.email}</td>
                      </tr>
                      <tr>
                        <td>Phone: </td>
                        <td>{opportunity.contact.phone}</td>
                      </tr>
                      <tr>
                        <td>Mobile: </td>
                        <td>{opportunity.contact.mobile}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                  <h6 className="pagegrouphdg win-input-hdgpadding">Account data</h6>
                  <table className="tble win-input-hdgpadding">
                    <tbody>
                      <tr>
                        <td>Name: </td>
                        <td>
                          <a href={"/account/" + opportunity.account.id}>{opportunity.account.name}</a>
                        </td>
                      </tr>
                      <tr>
                        <td>E-mail: </td>
                        <td>{opportunity.account.email}</td>
                      </tr>
                      <tr>
                        <td>Phone: </td>
                        <td>{opportunity.account.phone}</td>
                      </tr>
                      <tr>
                        <td>Industry: </td>
                        <td>{opportunity.account.industry}</td>
                      </tr>
                    </tbody>
                  </table>
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
      <h1 style={{ color: "grey" }}>No opportunity found</h1>
    </div>;
  }
}

export default OneOpportunityPage;
