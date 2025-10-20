import React from "react";
import "../../style/home.css";
import "../../style/wininput.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
import LeadForm from "../forms/LeadForm.jsx";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paginator from "../controls/Paginator.jsx";

function LeadsPage() {
  const [page, setPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [maxPages, setMaxPages] = useState(1);
  const [leads, setLeads] = useState(null);
  const [dispLeads, setDispLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(1);
  const [currLead, setCurrLead] = useState(null);

  const navigate = useNavigate();

  // CONFIGS
  var cfgNewLead = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/newlead",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
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

  var cfgGetLeads = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/mycompanyleads",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteLeads = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deletelead",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  // PAGE LOAD

  useEffect(() => {
    if (leads === null) {
      refreshLeads();
    }
  }, []);

  // LEAD FORM SUBMIT
  function submitForm(data) {
    cfgNewLead.data = data;
    axios(cfgNewLead)
      .then(function (response) {
        if (response.status === 200) {
          refreshLeads();
          toast.info("Successfully created lead.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  function submitFormUpdate(data) {
    cfgUpdateLead.data = data;
    axios(cfgUpdateLead)
      .then(function (response) {
        if (response.status === 200) {
          refreshLeads();
          toast.success("Successfully updated lead.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // LEAD TABLE
  function setTable(startindex, endindex) {
    console.log("Start: " + startindex + " End: " + endindex + " Max: " + leads.length);
    setDispLeads(leads.slice(startindex, endindex));
  }

  function refreshLeads() {
    axios(cfgGetLeads)
      .then(function (response) {
        if (response.status === 200) {
          setLeads(response.data.leads);
          setMaxPages(response.data.leads.length / elementsPerPage);
          setDispLeads(response.data.leads.slice(0, elementsPerPage));
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
  function showupdateform(i) {
    console.log(i);
    closeform();
    clearform(true);
    setCurrLead(leads[i]);
    setShowForm(true);
  }

  function shownewform() {
    closeform();
    clearform(true);
    setCurrLead(null);
    setShowForm(true);
  }

  function clearform(x) {
    if (x == true) {
      setFormKey(Math.random() * 10);
    }
  }

  function closeform() {
    setCurrLead(null);
    setShowForm(false);
  }

  function showdeletetoast(i) {
    toast.warning("Are you sure you want to delete the lead?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteLead(i),
      },
      duration: Infinity,
    });
  }
  function deleteLead(i) {
    cfgDeleteLeads.url = "http://127.0.0.1:8000/api/deletelead/" + leads[i].id;
    axios(cfgDeleteLeads)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted lead.");
          refreshLeads();
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // MAIN VIEW
  return (
    <div>
      <Header></Header>
      <NavMenu></NavMenu>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-lg-1 sidecol"></div>
          <div className="col-lg gx-0 gy-0">
            {showForm && <LeadForm key={formKey} lead={currLead} onSubmit={submitForm} onUpdate={submitFormUpdate} onClear={clearform} onClose={closeform}></LeadForm>}
            <div>
              <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                <div>
                  <h6 className="pagegrouphdg win-input-hdgpadding">Leads list</h6>
                </div>
                <div>
                  <button type="button" className="btn-win7" onClick={() => shownewform()}>
                    New
                  </button>
                </div>
                <br></br>
                <div className="tableview">
                  {leads === null ? (
                    " "
                  ) : (
                    <table className="tble w-100">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Assigned to</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dispLeads.map((t, i) => (
                          <tr key={i}>
                            <td>
                              <a href="#" style={{ color: "black" }} onClick={() => showupdateform(i)}>
                                Edit
                              </a>
                              &nbsp;&nbsp;|&nbsp;&nbsp;
                              <a href="#" style={{ color: "black" }} onClick={() => showdeletetoast(i)}>
                                Delete
                              </a>
                            </td>
                            <td>#{t.id}</td>
                            <td>
                              <a href={"lead/" + t.id} style={{ color: "black" }}>
                                {t.title}
                              </a>
                            </td>
                            <td>{t.owner.name + " " + t.owner.lastname}</td>
                            <td>{t.status.name}</td>
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
}

export default LeadsPage;
