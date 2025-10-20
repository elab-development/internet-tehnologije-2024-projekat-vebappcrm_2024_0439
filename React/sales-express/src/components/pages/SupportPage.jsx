import React from "react";
import "../../style/home.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
function SupportPage() {
  return (
    <div>
      <Header></Header>
      <NavMenu></NavMenu>
      <div className="container">
        <h1>Help & Support</h1>
        <p>SalesExpress version 1.1.2</p>
        <p>Refer to the documentation for use.</p>
        <p>In case you notice a bug or an error, send an email to: </p>
        <a href="mailto:sales.express.app@gmail.com">sales.express@gmail.com</a>
      </div>
    </div>
  );
}

export default SupportPage;
