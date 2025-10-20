import React, { useState, useEffect } from "react";
import "../../style/home.css";
import "../../style/wininput.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
import { useCookies } from "react-cookie";
import axios from "axios";

function SettingsPage() {
  const [cookies, setCookie] = useCookies(["userSettings"]);
  const [sq, setSQ] = useState(true);

  
  const getParsedSettings = (cookieVal) => {
    if (!cookieVal) return null;
    if (typeof cookieVal === "string") {
      try {
        return JSON.parse(cookieVal);
      } catch {
        console.warn("Cookie was not valid JSON, resetting...");
        return null;
      }
    }
    
    return cookieVal;
  };

  useEffect(() => {
    const existing = getParsedSettings(cookies.userSettings);
    if (!existing) {
      const defaultSettings = { showquotes: true };

      setCookie("userSettings", defaultSettings, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });

      console.log("Settings cookie created:", defaultSettings);
      setSQ(defaultSettings.showquotes);
    } else {
      console.log("Settings cookie found:", existing);
      setSQ(existing.showquotes);
    }
  }, [cookies, setCookie]);

  function changeSettings(e) {
    const newValue = e.target.checked;
    setSQ(newValue);

    const existing = getParsedSettings(cookies.userSettings) || {};
    const updatedSettings = { ...existing, showquotes: newValue };

    
    setCookie("userSettings", updatedSettings, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    console.log("Updated cookie:", updatedSettings);
  }

  return (
    <div className="overflow-hidden">
      <Header />
      <NavMenu />
      <div className="row">
        <div className="col-lg-1 sidecol"></div>
        <div className="col-lg gx-0 gy-0">
          <div className="win-input-greybg win-input-rb win-input-margin win-input-padding win-input-hlorange">
            <h6 className="pagegrouphdg win-input-hdgpadding">Settings</h6>
            <br />
            Show quote on homepage: <input type="checkbox" checked={sq} onChange={changeSettings} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
