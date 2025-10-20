import React from "react";
import "../../style/home.css";
import "../../style/wininput.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paginator from "../controls/Paginator.jsx";
import ContactForm from "../forms/ContactForm.jsx";

function ContactsPage() {
  const [page, setPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [maxPages, setMaxPages] = useState(1);
  const [contacts, setContacts] = useState(null);
  const [dispContacts, setDispContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(1);
  const [currContact, setCurrContact] = useState(null);

  const navigate = useNavigate();

  // CONFIGS
  var cfgNewContact = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/newcontact",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
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

  var cfgGetContacts = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/mycompanycontacts",
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
    if (contacts === null) {
      refreshContacts();
    }
  }, []);

  // CONTACT FORM SUBMIT
  function submitForm(data) {
    cfgNewContact.data = data;
    axios(cfgNewContact)
      .then(function (response) {
        if (response.status === 200) {
          refreshContacts();
          toast.info("Successfully created contact.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  function submitFormUpdate(data) {
    cfgUpdateContact.data = data;
    axios(cfgUpdateContact)
      .then(function (response) {
        if (response.status === 200) {
          refreshContacts();
          toast.success("Successfully updated contact.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // CONTACT TABLE
  function setTable(startindex, endindex) {
    console.log("Start: " + startindex + " End: " + endindex + " Max: " + contacts.length);
    setDispContacts(contacts.slice(startindex, endindex));
  }

  function refreshContacts() {
    axios(cfgGetContacts)
      .then(function (response) {
        if (response.status === 200) {
          setContacts(response.data.contacts);
          setMaxPages(response.data.contacts.length / elementsPerPage);
          setDispContacts(response.data.contacts.slice(0, elementsPerPage));
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

  // CONTACT FORM CONTROL
  function showupdateform(i) {
    console.log(i);
    closeform();
    clearform(true);
    setCurrContact(contacts[i]);
    setShowForm(true);
  }

  function shownewform() {
    closeform();
    clearform(true);
    setCurrContact(null);
    setShowForm(true);
  }

  function clearform(x) {
    if (x == true) {
      setFormKey(Math.random() * 10);
    }
  }

  function closeform() {
    setCurrContact(null);
    setShowForm(false);
  }

  function showdeletetoast(i) {
    toast.warning("Are you sure you want to delete the contact?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteContact(i),
      },
      duration: Infinity,
    });
  }
  function deleteContact(i) {
    cfgDeleteContact.url = "http://127.0.0.1:8000/api/deletecontact/" + contacts[i].id;
    axios(cfgDeleteContact)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted contact.");
          refreshContacts();
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
            {showForm && <ContactForm key={formKey} contact={currContact} onSubmit={submitForm} onUpdate={submitFormUpdate} onClear={clearform} onClose={closeform}></ContactForm>}
            <div>
              <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                <div>
                  <h6 className="pagegrouphdg win-input-hdgpadding">Contacts list</h6>
                </div>
                <div>
                  <button type="button" className="btn-win7" onClick={() => shownewform()}>
                    New
                  </button>
                </div>
                <br></br>
                <div className="tableview">
                  {contacts === null ? (
                    " "
                  ) : (
                    <table className="tble w-100">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Title</th>
                          <th>Account</th>
                          <th>E-mail</th>
                          <th>Phone</th>
                          <th>Mobile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dispContacts.map((t, i) => (
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
                              <a href={"contact/" + t.id} style={{ color: "black" }}>
                                {t.firstname + " " + t.lastname}
                              </a>
                            </td>
                            <td>{t.title}</td>
                            <td>
                              <a href={"account/" + t.account.id} style={{ color: "black" }}>
                                {t.account.name}
                              </a>
                            </td>
                            <td>{t.email}</td>
                            <td>{t.phone}</td>
                            <td>{t.mobile}</td>
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

export default ContactsPage;
