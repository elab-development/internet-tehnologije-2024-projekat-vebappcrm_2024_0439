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
import OpportunityForm from "../forms/OpportunityForm.jsx";

function OpportunitiesPage() {
  const [page, setPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [maxPages, setMaxPages] = useState(1);
  const [opportunities, setOpportunities] = useState(null);
  const [dispOpts, setDispOpts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(1);
  const [currOpportunity, setCurrOpportunity] = useState(null);

  const navigate = useNavigate();

  // CONFIGS

  var cfgUpdateOpt = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updateopportunity",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgGetOpportunities = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/mycompanyopportunities",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteOpportunity = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deleteopportunity",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  // PAGE LOAD

  useEffect(() => {
    if (opportunities === null) {
      refreshOpts();
    }
  }, []);

  // OPPORTUNITY FORM SUBMIT

  function submitFormUpdate(data) {
    cfgUpdateOpt.data = data;
    axios(cfgUpdateOpt)
      .then(function (response) {
        if (response.status === 200) {
          refreshOpts();
          toast.success("Successfully updated opportunity.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // OPPORTUNITY TABLE
  function setTable(startindex, endindex) {
    console.log("Start: " + startindex + " End: " + endindex + " Max: " + opportunities.length);
    setDispOpts(opportunities.slice(startindex, endindex));
  }

  function refreshOpts() {
    axios(cfgGetOpportunities)
      .then(function (response) {
        if (response.status === 200) {
          setOpportunities(response.data.opportunities);
          setMaxPages(response.data.opportunities.length / elementsPerPage);
          setDispOpts(response.data.opportunities.slice(0, elementsPerPage));
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

  // OPPORTUNITY FORM CONTROL
  function showupdateform(i) {
    console.log(i);
    closeform();
    clearform(true);
    setCurrOpportunity(opportunities[i]);
    setShowForm(true);
  }

  function shownewform() {
    closeform();
    clearform(true);
    setCurrOpportunity(null);
    setShowForm(true);
  }

  function clearform(x) {
    if (x == true) {
      setFormKey(Math.random() * 10);
    }
  }

  function closeform() {
    setCurrOpportunity(null);
    setShowForm(false);
  }

  function showdeletetoast(i) {
    toast.warning("Are you sure you want to delete the opportunity?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteOpt(i),
      },
      duration: Infinity,
    });
  }
  function deleteOpt(i) {
    cfgDeleteOpportunity.url = "http://127.0.0.1:8000/api/deleteopportunity/" + opportunities[i].id;
    axios(cfgDeleteOpportunity)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted opportunity.");
          refreshOpts();
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
            {showForm && <OpportunityForm key={formKey} opportunity={currOpportunity} onUpdate={submitFormUpdate} onClear={clearform} onClose={closeform}></OpportunityForm>}
            <div>
              <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                <div>
                  <h6 className="pagegrouphdg win-input-hdgpadding">Opportunities list</h6>
                </div>
                <div></div>
                <br></br>
                <div className="tableview">
                  {opportunities === null ? (
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
                          <th>Contact</th>
                          <th>Account</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dispOpts.map((t, i) => (
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
                              <a href={"/opportunity/" + t.id} style={{ color: "black" }}>
                                {t.title}
                              </a>
                            </td>
                            <td>{t.owner.name + " " + t.owner.lastname}</td>
                            <td>{t.status.name}</td>
                            <td>{t.contact.firstname + " " + t.contact.lastname}</td>
                            <td>{t.account.name}</td>
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

export default OpportunitiesPage;
