import React, { useEffect, useState } from "react";
import "../../style/home.css";
import "../../style/wininput.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
import { toast } from "sonner";
import axios from "axios";
import CompanyInfoForm from "../forms/CompanyInfoForm.jsx";
import { IoMdCopy } from "react-icons/io";

function CompanyInfoPage() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(1);

  var cfgGetCIData = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/mycompany",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
    },
    data: {},
  };

  var cfgUpdateCI = {
    method: "patch",
    maxBodyLength: Infinity,
    url: "http://127.0.0.1:8000/api/updatecompany",
    headers: {
      Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
      "Content-Type": "multipart/form-data",
    },
    data: {},
  };
  useEffect(() => {
    axios(cfgGetCIData)
      .then(function (response) {
        if (response.status === 200) {
          setCompanyInfo(response.data.company);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }, []);
  function submitFormUpdate(data) {
    const d = new FormData();
    for (const key in data) {
      d.append(key, data[key]);
    }
    axios
      .post("http://127.0.0.1:8000/api/updatecompany", d, {
        headers: {
          Authorization: "Bearer " + window.sessionStorage.getItem("CURRENT_AUTH_TOKEN"),
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("Successfully updated company info.");
        refreshCI();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // COMPANY DATA
  function refreshCI() {
    axios(cfgGetCIData)
      .then(function (response) {
        if (response.status === 200) {
          setCompanyInfo(response.data.company);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Error: " + error.message);
      });
  }

  // COMPANY FORM CONTROL
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("http://127.0.0.1:3000/register/" + companyInfo.id);
      toast.info("Copied invite link.");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // MAIN VIEW

  return (
    <div>
      <Header></Header>
      <NavMenu></NavMenu>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-lg-1 sidecol"></div>
          <div className="col-lg gx-0 gy-0">
            {showForm && <CompanyInfoForm key={formKey} company={companyInfo} onClear={clearform} onUpdate={submitFormUpdate} onClose={closeform}></CompanyInfoForm>}
            {companyInfo !== null ? (
              <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
                <div className="d-flex align-items-center win-input-hdgpadding">
                  <div>
                    <img src={require("../../img/company-icon-sm.png")} alt="icon"></img>
                  </div>
                  <div>
                    <h5 className="pagegrouphdg ">&nbsp;&nbsp;&nbsp;&nbsp;Company Info</h5>
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
                      <td>
                        <img alt="companylogo" src={companyInfo.imgpath}></img>
                      </td>
                    </tr>
                    <tr>
                      <td>Name: </td>
                      <td>{companyInfo.name}</td>
                    </tr>
                    <tr>
                      <td>Address:</td>
                      <td>{companyInfo.address}</td>
                    </tr>
                    <tr>
                      <td>Invite link:</td>
                      <td>
                        <input type="text" readonly value={"http://127.0.0.1:3000/register/" + companyInfo.id}></input>
                      </td>
                      <td>
                        <button className="btn-win7 btn-ico" type="button" onClick={handleCopy}>
                          <IoMdCopy />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Description: </td>
                    </tr>
                  </tbody>
                </table>
                <textarea name="description" disabled rows="10" cols="100" className="win-input" id="description" value={companyInfo.description} />
              </div>
            ) : (
              <h1 style={{ color: "lightgrey" }}>Loading company data</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyInfoPage;
