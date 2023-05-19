import React from "react";
import { useUserRole } from "../context/UserRoleContext";

const RoleBasedAccess = ({ children, roles }) => {
  const { userRole } = useUserRole();

  console.log("userRole:", userRole);
  console.log("roles:", roles);
  
  if (roles.includes(userRole)) {
    return children;
  } else return <div>Interzis</div>;

  return null;
};

export default RoleBasedAccess;
