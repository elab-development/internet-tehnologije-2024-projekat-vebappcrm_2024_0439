import React from "react";
import "../../style/header.css";

function Header() {
  var username = window.sessionStorage.getItem("CURRENT_USER_NAME");
  return (
    <div className="hdr d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
      <img className="hdrimg" src={require("../../img/se-logo-small.png")} alt="logo" />

      <div className="dropdown">
        <a href="#" className="dropdown-toggle text-decoration-none" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          {username}
        </a>
        <ul className="dropdown-menu shadow-sm">
          <li>
            <a className="dropdown-item" href="/myprofile">
              Profile
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="/settings">
              Settings
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="/support">
              Support
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item text-danger" href="/logout">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
