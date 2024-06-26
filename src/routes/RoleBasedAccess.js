import React from "react";
import { useUserRole } from "../context/UserRoleContext";
import { useNavigate } from "react-router";

const RoleBasedAccess = ({ children, roles }) => {
  const { userRole } = useUserRole();
  const navigate = useNavigate();
  if (roles.includes(userRole)) {
    return children;
  } else {
    return <div>Interzis</div>;
  }

  return null;
};

export default RoleBasedAccess;
