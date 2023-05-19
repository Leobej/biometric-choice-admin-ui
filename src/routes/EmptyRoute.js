import React from "react";
import { useUserRole } from "../context/UserRoleContext";

const EmptyRoute = ({ children, roles }) => {
  const { userRole } = useUserRole();

  console.log("userRole:", userRole);
  console.log("roles:", roles);

  if (roles.includes(userRole)) {
    return children;
  }
  else return <></>

  return null;
};

export default EmptyRoute;
