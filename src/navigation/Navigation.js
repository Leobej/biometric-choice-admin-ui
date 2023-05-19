// src/components/Navigation.js
import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="flex justify-between bg-gray-800 p-6">
      <ul className="flex justify-between w-full">
        <li className="mr-6">
          <NavLink
            to="/"
            exact
            activeClassName="text-yellow-500"
            className="text-white text-lg hover:text-gray-300"
          >
            Dashboard
          </NavLink>
        </li>
        <li className="mr-6">
          <NavLink
            to="/elections"
            activeClassName="text-yellow-500"
            className="text-white text-lg hover:text-gray-300"
          >
            Elections
          </NavLink>
        </li>
        <li className="mr-6">
          <NavLink
            to="/candidates"
            activeClassName="text-yellow-500"
            className="text-white text-lg hover:text-gray-300"
          >
            Candidates
          </NavLink>
        </li>
        <li className="mr-6">
          <NavLink
            to="/voters"
            activeClassName="text-yellow-500"
            className="text-white text-lg hover:text-gray-300"
          >
            Voters
          </NavLink>
        </li>
        <li>
          {" "}
          <NavLink
            to="/logged-in"
            exact
            activeClassName="text-yellow-500"
            className="text-white text-lg hover:text-gray-300"
          >
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
