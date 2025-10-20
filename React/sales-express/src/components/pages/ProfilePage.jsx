import React, { useEffect, useState } from "react";
import "../../style/home.css";
import "../../style/wininput.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
import { toast } from "sonner";
import axios from "axios";
import UserForm from "../forms/UserForm.jsx";
function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(1);

  var cfgGetUserData = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/user",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgUpdateUser = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updatemyprofile",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };
  useEffect(() => {
    axios(cfgGetUserData)
      .then(function (response) {
        if (response.status === 200) {
          setUserData(response.data.user);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }, []);
  function submitFormUpdate(data) {
    console.log(data);
    cfgUpdateUser.data = data;
    axios(cfgUpdateUser)
      .then(function (response) {
        if (response.status === 200) {
          toast.success(
            <div>
              <p>Successfully updated profile.</p>
              <p>
                <b>Note: Please relog to update your data across the site.</b>
              </p>
            </div>
          );
          refreshUserData();
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // USER DATA
  function refreshUserData() {
    axios(cfgGetUserData)
      .then(function (response) {
        if (response.status === 200) {
          setUserData(response.data.user);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // PROFILE FORM CONTROL
  function showupdateform() {
    closeform();
    clearform(true);
    setShowForm(true);
  }
  function clearform(x) {
    if (x == true) {
      setFormKey(Math.random() * 10);
    }
  }

  function closeform() {
    setShowForm(false);
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
            {showForm && <UserForm user={userData} onClear={clearform} onUpdate={submitFormUpdate} onClose={closeform}></UserForm>}
            {userData !== null ? (
              <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                <div className="d-flex align-items-center win-input-hdgpadding">
                  <div>
                    <img src={require("../../img/user-icon-sm.png")} alt="icon"></img>
                  </div>
                  <div>
                    <h5 className="pagegrouphdg ">&nbsp;&nbsp;&nbsp;&nbsp;My profile</h5>
                  </div>
                </div>
                <br></br>
                <button type="button" className="btn-win7" onClick={() => showupdateform()}>
                  Edit
                </button>
                <br></br>
                <table className="tble win-input-hdgpadding">
                  <tbody>
                    <tr>
                      <td>Name: </td>
                      <td>{userData.name}</td>
                    </tr>
                    <tr>
                      <td>Last name: </td>
                      <td>{userData.lastname}</td>
                    </tr>
                    <tr>
                      <td>Role: </td>
                      <td>{userData.companyrole.name}</td>
                    </tr>
                    <tr>
                      <td>E-mail: </td>
                      <td>{userData.email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <h1 style={{ color: "lightgrey" }}>Loading user data</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
