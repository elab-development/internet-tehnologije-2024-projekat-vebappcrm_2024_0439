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
import AccountForm from "../forms/AccountForm.jsx";

function AccountsPage() {
  const [page, setPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [maxPages, setMaxPages] = useState(1);
  const [accounts, setAccounts] = useState(null);
  const [dispAccounts, setDispAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(1);
  const [currAccount, setCurrAccount] = useState(null);

  const navigate = useNavigate();

  // CONFIGS
  var cfgNewAccount = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/newaccount",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgUpdateAccount = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updateaccount",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgGetAccounts = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/mycompanyaccounts",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteAccount = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deleteaccount",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  // PAGE LOAD

  useEffect(() => {
    if (accounts === null) {
      refreshAccounts();
    }
  }, []);

  // ACCOUNT FORM SUBMIT
  function submitForm(data) {
    cfgNewAccount.data = data;
    axios(cfgNewAccount)
      .then(function (response) {
        if (response.status === 200) {
          refreshAccounts();
          toast.info("Successfully created account.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  function submitFormUpdate(data) {
    cfgUpdateAccount.data = data;
    axios(cfgUpdateAccount)
      .then(function (response) {
        if (response.status === 200) {
          refreshAccounts();
          toast.success("Successfully updated account.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // ACCOUNT TABLE
  function setTable(startindex, endindex) {
    console.log("Start: " + startindex + " End: " + endindex + " Max: " + accounts.length);
    setDispAccounts(accounts.slice(startindex, endindex));
  }

  function refreshAccounts() {
    axios(cfgGetAccounts)
      .then(function (response) {
        if (response.status === 200) {
          setAccounts(response.data.accounts);
          setMaxPages(response.data.accounts.length / elementsPerPage);
          setDispAccounts(response.data.accounts.slice(0, elementsPerPage));
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

  // ACCOUNT FORM CONTROL
  function showupdateform(i) {
    console.log(i);
    closeform();
    clearform(true);
    setCurrAccount(accounts[i]);
    setShowForm(true);
  }

  function shownewform() {
    closeform();
    clearform(true);
    setCurrAccount(null);
    setShowForm(true);
  }

  function clearform(x) {
    if (x == true) {
      setFormKey(Math.random() * 10);
    }
  }

  function closeform() {
    setCurrAccount(null);
    setShowForm(false);
  }

  function showdeletetoast(i) {
    toast.warning("Are you sure you want to delete the account?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteAccount(i),
      },
      duration: Infinity,
    });
  }
  function deleteAccount(i) {
    cfgDeleteAccount.url = "http://127.0.0.1:8000/api/deleteaccount/" + accounts[i].id;
    axios(cfgDeleteAccount)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted account.");
          refreshAccounts();
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
            {showForm && <AccountForm key={formKey} account={currAccount} onSubmit={submitForm} onUpdate={submitFormUpdate} onClear={clearform} onClose={closeform}></AccountForm>}
            <div>
              <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                <div>
                  <h6 className="pagegrouphdg win-input-hdgpadding">Accounts list</h6>
                </div>
                <div>
                  <button type="button" className="btn-win7" onClick={() => shownewform()}>
                    New
                  </button>
                </div>
                <br></br>
                <div className="tableview">
                  {accounts === null ? (
                    " "
                  ) : (
                    <table className="tble w-100">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>E-mail</th>
                          <th>Phone</th>
                          <th>Website</th>
                          <th>Industry</th>
                          <th>Billing Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dispAccounts.map((t, i) => (
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
                              <a href={"account/" + t.id} style={{ color: "black" }}>
                                {t.name}
                              </a>
                            </td>
                            <td>{t.email}</td>
                            <td>{t.phone}</td>
                            <td>{t.website}</td>
                            <td>{t.industry}</td>
                            <td>{t.billingaddress}</td>
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

export default AccountsPage;
