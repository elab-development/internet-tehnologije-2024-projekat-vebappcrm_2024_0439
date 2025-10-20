import React from "react";
import "../../style/home.css";
import Header from "../blocks/HeaderBlock.jsx";
import NavMenu from "../controls/NavMenu.jsx";
import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
function Home() {
  const [cookies, setCookie] = useCookies(["userSettings"]);
  const [quote, setQuote] = useState(null);
  const [showQuote, setShowQuote] = useState(null);
  var cfgGetQot = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://api.quotable.io/quotes/random?tags=business",
    headers: {},
    data: {},
  };

  const getParsedSettings = (cookieVal) => {
    if (!cookieVal) return null;
    if (typeof cookieVal === "string") {
      try {
        return JSON.parse(cookieVal);
      } catch {
        console.warn("Cookie was not valid JSON");
        return null;
      }
    }
    return cookieVal;
  };

  useEffect(() => {
    const settings = getParsedSettings(cookies.userSettings);

    if (settings) {
      console.log("User settings loaded:", settings);
      setShowQuote(settings.showquotes == true);
    } else {
      console.log("No settings cookie found — using defaults.");
      setShowQuote(true);
    }
  }, [cookies]);

  useEffect(() => {
    if (showQuote == true) {
      axios(cfgGetQot)
        .then(function (response) {
          if (response.status === 200) {
            console.log(response);
            setQuote(response.data[0]);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [showQuote]);

  return (
    <div>
      <Header></Header>
      <NavMenu></NavMenu>
      <div className="container">
        <h1>Welcome to the Home Page of SalesExpress!</h1>
        <p>Have a productive day!</p>
        {quote && (
          <blockquote>
            &ldquo;{quote.content}&rdquo; &mdash; <footer>{quote.author}</footer>
          </blockquote>
        )}
      </div>
    </div>
  );
}

export default Home;
