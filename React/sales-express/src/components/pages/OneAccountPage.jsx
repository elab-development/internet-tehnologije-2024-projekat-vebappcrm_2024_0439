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
import ContactForm from "../forms/ContactForm.jsx";
import AccountForm from "../forms/AccountForm.jsx";
function OneAccountPage() {
  const acParams = useParams();
  const [account, setAccount] = useState(null);
  const [showAccForm, setShowAccForm] = useState(false);
  const [accFormKey, setAccFormKey] = useState(1);
  const navigate = useNavigate();

  var cfgGetAccount = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/account/" + acParams.account_id,
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
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
    if (account === null) {
      refreshAccountData();
    }
  }, []);

  function submitCtFormUpdate(data) {
    cfgUpdateAccount.data = data;
    axios(cfgUpdateAccount)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully updated contact.");
          refreshAccountData();
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // CONTACT DATA
  function refreshAccountData() {
    cfgGetAccount.url = "http://127.0.0.1:8000/api/account/" + acParams.account_id;
    console.log(cfgGetAccount.url);
    axios(cfgGetAccount)
      .then(function (response) {
        if (response.status === 200) {
          setAccount(response.data.account);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // CONTACT FORM CONTROL
  function showdeletecttoast() {
    toast.warning("Are you sure you want to delete the account?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteAccount(),
      },
      duration: Infinity,
    });
  }

  function showupdatectform() {
    closectform();
    clearctform(true);
    setShowAccForm(true);
  }
  function clearctform(x) {
    if (x == true) {
      setAccFormKey(Math.random() * 10);
    }
  }

  function closectform() {
    setShowAccForm(false);
  }

  function deleteAccount() {
    cfgDeleteAccount.url = "http://127.0.0.1:8000/api/deleteaccount/" + account.id;
    axios(cfgDeleteAccount)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted account.");
          navigate("/accounts");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // MAIN VIEW
  if (account !== null) {
    return (
      <div>
        <Header></Header>
        <NavMenu></NavMenu>
        <div className="overflow-hidden">
          <div className="row">
            <div className="col-lg-1 sidecol">
              <a href="/accounts">
                <span>
                  <FaArrowLeft />
                </span>
                &nbsp; Back to accounts
              </a>
            </div>
            <div className="col-lg gx-0 gy-0">
              {showAccForm && <AccountForm key={accFormKey} account={account} onUpdate={submitCtFormUpdate} onClear={clearctform} onClose={closectform}></AccountForm>}
              <div>
                <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                  <h5 className="pagegrouphdg win-input-hdgpadding">Account info</h5>
                  <br></br>
                  <button type="button" className="btn-win7" onClick={() => showupdatectform()}>
                    Edit
                  </button>
                  &nbsp;
                  <button type="button" className="btn-win7" onClick={() => showdeletecttoast()}>
                    Delete
                  </button>
                  <br></br>
                  <br></br>
                  <br></br>
                  <table className="tble win-input-hdgpadding">
                    <tbody>
                      <tr>
                        <td>Name: </td>
                        <td>{account.name}</td>
                      </tr>
                      <tr>
                        <td>E-mail: </td>
                        <td>{account.email}</td>
                      </tr>
                      <tr></tr>
                      <tr>
                        <td>Phone: </td>
                        <td>{account.phone}</td>
                      </tr>
                      <tr>
                        <td>Billing Address: </td>
                        <td>{account.billingaddress}</td>
                      </tr>
                      <tr>
                        <td>Industry: </td>
                        <td>{account.industry}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <br></br>
              </div>
              <br></br>
            </div>
            <br></br>
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

export default OneAccountPage;
