import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useUserRole } from "./../context/UserRoleContext"

const ProtectedRoute = ({ element, roles, ...rest }) => {
  const { userRole } = useUserRole();
  if (roles.includes(userRole)) {
    return <Route {...rest} element={element} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
