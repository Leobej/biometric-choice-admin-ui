import { createContext, useContext, useState } from "react";

const UserRoleContext = createContext();

export const useUserRole = () => useContext(UserRoleContext);

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  console.log(userRole);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
