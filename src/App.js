import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import FingerprintRegistration from "./fingerprintregistration/FingerprintRegistration";
import AdminDashboard from "./admin/AdminDashboard";
import CreateElectionForm from "./admin/election/AddElectionModal";
import CreateCandidateForm from "./admin/candidate/AddCandidateModal";
import Home from "./home/Home";
import { UserRoleProvider } from "./context/UserRoleContext";
import RoleBasedAccess from "./routes/RoleBasedAccess";
import NotFoundPage from "./notfound/NotFoundPage";
import ElectionsList from "./admin/election/ElectionList";
import Navigation from "./navigation/Navigation";
import EmptyRoute from "./routes/EmptyRoute";
import LoggedIn from "./home/LoggedIn";
import CandidatesList from "./admin/candidate/CandidatesList";
import VotersList from "./admin/voter/VotersList";
import DevicesList from "./admin/device/DeviceList";
import LocationsList from "./admin/locations/LocationsList";
function App() {
  return (
    <Router>
      <UserRoleProvider>
        <EmptyRoute roles={["ADMIN"]}>
          <Navigation />
        </EmptyRoute>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <AdminDashboard />
              </RoleBasedAccess>
            }
          />
          <Route
            path="/registration"
            element={
              <RoleBasedAccess roles={["USER"]}>
                <FingerprintRegistration />
              </RoleBasedAccess>
            }
          />
          <Route path="/home" element={<Home />} />
          <Route
            path="/elections"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <ElectionsList />
              </RoleBasedAccess>
            }
          />
          <Route
            path="/candidates"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <CandidatesList />
              </RoleBasedAccess>
            }
          />
          <Route
            path="/voters"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <VotersList />
              </RoleBasedAccess>
            }
          />
          <Route
            path="/devices"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <DevicesList />
              </RoleBasedAccess>
            }
          />
          <Route
            path="/locations"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <LocationsList />
              </RoleBasedAccess>
            }
          />
          {/* <Route
            path="/create-election"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <CreateElectionForm />
              </RoleBasedAccess>
            }
          /> */}
          <Route
            path="/create-candidates"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <CreateCandidateForm />
              </RoleBasedAccess>
            }
          />
          <Route
            path="/logged-in"
            element={
              <RoleBasedAccess roles={["ADMIN"]}>
                <LoggedIn />
              </RoleBasedAccess>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </UserRoleProvider>
    </Router>
  );
}

export default App;
