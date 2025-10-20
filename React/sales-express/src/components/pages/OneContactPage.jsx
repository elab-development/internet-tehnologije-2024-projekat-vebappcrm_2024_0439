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
function OneContactPage() {
  const ctParams = useParams();
  const [contact, setContact] = useState(null);
  const [showCtForm, setShowCtForm] = useState(false);
  const [actFormKey, setActFormKey] = useState(1);
  const navigate = useNavigate();

  var cfgGetContact = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/contact/" + ctParams.contact_id,
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  var cfgUpdateContact = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updatecontact",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteContact = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deletecontact",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  // PAGE LOAD
  useEffect(() => {
    if (contact === null) {
      refreshContactData();
    }
  }, []);

  function submitCtFormUpdate(data) {
    cfgUpdateContact.data = data;
    axios(cfgUpdateContact)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully updated contact.");
          refreshContactData();
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // CONTACT DATA
  function refreshContactData() {
    cfgGetContact.url = "http://127.0.0.1:8000/api/contact/" + ctParams.contact_id;
    console.log(cfgGetContact.url);
    axios(cfgGetContact)
      .then(function (response) {
        if (response.status === 200) {
          setContact(response.data.contact);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // CONTACT FORM CONTROL
  function showdeletecttoast() {
    toast.warning("Are you sure you want to delete the contact?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteContact(),
      },
      duration: Infinity,
    });
  }

  function showupdatectform() {
    closectform();
    clearctform(true);
    setShowCtForm(true);
  }
  function clearctform(x) {
    if (x == true) {
      setActFormKey(Math.random() * 10);
    }
  }

  function closectform() {
    setShowCtForm(false);
  }

  function deleteContact() {
    cfgDeleteContact.url = "http://127.0.0.1:8000/api/deletecontact/" + contact.id;
    axios(cfgDeleteContact)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted contact.");
          navigate("/contacts");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // MAIN VIEW
  if (contact !== null) {
    return (
      <div>
        <Header></Header>
        <NavMenu></NavMenu>
        <div className="overflow-hidden">
          <div className="row">
            <div className="col-lg-1 sidecol">
              <a href="/contacts">
                <span>
                  <FaArrowLeft />
                </span>
                &nbsp; Back to contacts
              </a>
            </div>
            <div className="col-lg gx-0 gy-0">
              {showCtForm && <ContactForm key={actFormKey} contact={contact} onUpdate={submitCtFormUpdate} onClear={clearctform} onClose={closectform}></ContactForm>}
              <div>
                <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                  <div>
                    <h5 className="pagegrouphdg win-input-hdgpadding">Contact info</h5>
                  </div>
                  <div>
                    <button type="button" className="btn-win7" onClick={() => showupdatectform()}>
                      Edit
                    </button>
                    &nbsp;
                    <button type="button" className="btn-win7" onClick={() => showdeletecttoast()}>
                      Delete
                    </button>
                  </div>
                  <br></br>
                  <table className="tble win-input-hdgpadding">
                    <tbody>
                      <tr>
                        <td>Name: </td>
                        <td>{contact.firstname + " " + contact.lastname}</td>
                      </tr>
                      <tr>
                        <td>Title: </td>
                        <td>{contact.title}</td>
                      </tr>
                      <tr>
                        <td>Account: </td>
                        <td>
                          <a href={"/account/" + contact.account.id} style={{ color: "black" }}>
                            {contact.account.name}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>E-mail: </td>
                        <td>{contact.email}</td>
                      </tr>
                      <tr>
                        <td>Phone: </td>
                        <td>{contact.phone}</td>
                      </tr>
                      <tr>
                        <td>Mobile: </td>
                        <td>{contact.mobile}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <br></br>
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

export default OneContactPage;
