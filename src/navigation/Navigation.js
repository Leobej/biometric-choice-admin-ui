import React from "react";
import { NavLink } from "react-router-dom";
import { useUserRole } from "./../context/UserRoleContext";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router";

const Navigation = () => {
  const { userRole, setUserRole } = useUserRole();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setUserRole("");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={Logo}
              alt="Logo"
              className="h-12 w-12 mr-4 rounded-full"
            />
            <div className="flex space-x-4">
              {userRole === "ADMIN" && (
                <>
                  <NavLink
                    to="/elections"
                    activeClassName="text-yellow-500 border-b-2 border-yellow-500"
                    className="text-white text-lg px-4 py-2 hover:text-gray-300"
                  >
                    Elections
                  </NavLink>
                  <NavLink
                    to="/candidates"
                    activeClassName="text-yellow-500 border-b-2 border-yellow-500"
                    className="text-white text-lg px-4 py-2 hover:text-gray-300"
                  >
                    Candidates
                  </NavLink>
                  <NavLink
                    to="/voters"
                    activeClassName="text-yellow-500 border-b-2 border-yellow-500"
                    className="text-white text-lg px-4 py-2 hover:text-gray-300"
                  >
                    Voters
                  </NavLink>
                  <NavLink
                    to="/devices"
                    activeClassName="text-yellow-500 border-b-2 border-yellow-500"
                    className="text-white text-lg px-4 py-2 hover:text-gray-300"
                  >
                    Devices
                  </NavLink>
                  <NavLink
                    to="/locations"
                    activeClassName="text-yellow-500 border-b-2 border-yellow-500"
                    className="text-white text-lg px-4 py-2 hover:text-gray-300"
                  >
                    Locations
                  </NavLink>
                </>
              )}
            </div>
          </div>
          <div>
            {/* <NavLink
              to="/logged-in"
              exact
              activeClassName="text-yellow-500 border-b-2 border-yellow-500"
              className="text-white text-lg px-4 py-2 hover:text-gray-300"
            > */}
              <button onClick={handleLogout}>Logout</button>
            {/* </NavLink> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
