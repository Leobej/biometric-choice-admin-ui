import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import FingerprintRegistration from "./registration/FingerprintRegistration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<FingerprintRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
