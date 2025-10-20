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
import UserForm from "../forms/UserForm.jsx";

function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [maxPages, setMaxPages] = useState(1);
  const [employees, setEmployees] = useState(null);
  const [dispEmployees, setDispLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(1);
  const [currEmployee, setCurrEmployee] = useState(null);

  const navigate = useNavigate();

  // CONFIGS

  var cfgUpdateEmployee = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updateuser",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgGetEmployees = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/mycompanyemployees",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgDeleteEmployee = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/deleteuser",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
  };

  // PAGE LOAD

  useEffect(() => {
    if (employees === null) {
      refreshEmployees();
    }
  }, []);

  // EMPLOYEE FORM SUBMIT

  function submitFormUpdate(data) {
    cfgUpdateEmployee.data = data;
    axios(cfgUpdateEmployee)
      .then(function (response) {
        if (response.status === 200) {
          refreshEmployees();
          toast.success("Successfully updated employee.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // EMPLOYEE TABLE
  function setTable(startindex, endindex) {
    console.log("Start: " + startindex + " End: " + endindex + " Max: " + employees.length);
    setDispLeads(employees.slice(startindex, endindex));
  }

  function refreshEmployees() {
    axios(cfgGetEmployees)
      .then(function (response) {
        if (response.status === 200) {
          setEmployees(response.data.users);
          setMaxPages(response.data.users.length / elementsPerPage);
          setDispLeads(response.data.users.slice(0, elementsPerPage));
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
    setCurrEmployee(employees[i]);
    setShowForm(true);
  }

  function clearform(x) {
    if (x == true) {
      setFormKey(Math.random() * 10);
    }
  }

  function closeform() {
    setCurrEmployee(null);
    setShowForm(false);
  }

  function showdeletetoast(i) {
    toast.warning("Are you sure you want to delete the employee?", {
      cancel: {
        label: "No",
      },
      action: {
        label: "Yes",
        onClick: () => deleteEmployee(i),
      },
      duration: Infinity,
    });
  }
  function deleteEmployee(i) {
    cfgDeleteEmployee.url = "http://127.0.0.1:8000/api/deleteuser/" + employees[i].id;
    axios(cfgDeleteEmployee)
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Successfully deleted employee.");
          refreshEmployees();
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
            {showForm && <UserForm key={formKey} user={currEmployee} onUpdate={submitFormUpdate} onClear={clearform} onClose={closeform}></UserForm>}
            <div>
              <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                <div>
                  <h6 className="pagegrouphdg win-input-hdgpadding">Employees list</h6>
                </div>
                <br></br>
                <div className="tableview">
                  {employees === null ? (
                    " "
                  ) : (
                    <table className="tble w-100">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>E-mail</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dispEmployees.map((t, i) => (
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
                            <td>{t.name + " " + t.lastname}</td>
                            <td>{t.companyrole.name}</td>
                            <td>{t.email}</td>
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

export default EmployeesPage;
