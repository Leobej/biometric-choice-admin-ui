import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import FingerprintRegistration from "./registration/FingerprintRegistration";
import AdminDashboard from "./admin/AdminDashboard";
import CreateElectionForm from "./admin/CreateElectionForm";
import CreateCandidateForm from "./admin/CreateCandidateForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<FingerprintRegistration />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/create-election" element={<CreateElectionForm />} />
        <Route path="/create-candidates" element={<CreateCandidateForm/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
