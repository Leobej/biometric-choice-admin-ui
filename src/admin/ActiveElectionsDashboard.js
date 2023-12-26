import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ActiveElectionsDashboard = () => {
  const [activeElections, setActiveElections] = useState([]);

  useEffect(() => {
    // Fetch active elections
    const fetchActiveElections = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/elections/active", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveElections(response.data);
    };

    fetchActiveElections();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Active Elections</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Start Date</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">End Date</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeElections.map((election) => (
              <tr key={election.electionId}>
                <td className="text-left py-3 px-4">{election.description}</td>
                <td className="text-left py-3 px-4">{election.startDate}</td>
                <td className="text-left py-3 px-4">{election.endDate}</td>
                <td className="text-left py-3 px-4">
                  <Link to={`/elections/${election.electionId}`}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveElectionsDashboard;
