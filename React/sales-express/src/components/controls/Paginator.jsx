import React, { useEffect, useState } from "react";
import "../../style/home.css";
import "../../style/paginator.css";

function Paginator({ pageCount, active, onChange, onPrevious, onNext }) {
  var pages = [];

  for (let i = 0; i < pageCount; i++) {
    if (i == active) {
      pages.push(
        <li className="pgactive" key={i}>
          <a
            className="pglink"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onChange(i + 1);
            }}
          >
            {i + 1}
          </a>
        </li>
      );
    } else {
      pages.push(
        <li class="" key={i}>
          <a
            class="pglink"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onChange(i + 1);
            }}
          >
            {i + 1}
          </a>
        </li>
      );
    }
  }

  return (
    <nav aria-label="pages">
      <ul className="pagination">
        <li className="">
          <a
            className="pglink"
            href="#"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              onPrevious();
            }}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {pages}
        <li className="">
          <a
            className="pglink"
            href="#"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              onNext();
            }}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
export default Paginator;
