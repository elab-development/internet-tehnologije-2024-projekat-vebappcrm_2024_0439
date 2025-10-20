import React from "react";
import "../../style/navmenu.css";
import { NavLink } from "react-router-dom";
function NavMenu() {
  var sysrole = window.sessionStorage.getItem("CURRENT_USER_SYS_ROLE");
  var comrole = window.sessionStorage.getItem("CURRENT_USER_COM_ROLE");

  return (
    <nav>
      <ul class="sf-menu">
        <li>
          <NavLink className="" activeClassName="active" to="/home">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className="" activeClassName="active" to="/accounts">
            Accounts
          </NavLink>
        </li>
        <li>
          <NavLink className="" activeClassName="active" to="/contacts">
            Contacts
          </NavLink>
        </li>
        <li>
          <NavLink className="" activeClassName="active" to="/leads">
            Leads
          </NavLink>
        </li>
        <li>
          <NavLink className="" activeClassName="active" to="/opportunities">
            Opportunities
          </NavLink>
        </li>
        {comrole === "3" ? (
          <li>
            <NavLink className="" activeClassName="active" to="/employees">
              Employees
            </NavLink>
          </li>
        ) : (
          " "
        )}
        {comrole === "3" ? (
          <li>
            <NavLink className="" activeClassName="active" to="/mycompany">
              My Company
            </NavLink>
          </li>
        ) : (
          " "
        )}
      </ul>
    </nav>
  );
}

export default NavMenu;
