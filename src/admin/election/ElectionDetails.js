import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CandidateSelector from "./CandidateSelector"; // Make sure this component exists
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const ElectionDetails = () => {
  let { id } = useParams();
  const [electionData, setElectionData] = useState({
    candidates: [],
    electionResults: [],
  }); // Initialize to prevent map errors
  const [votingTrends, setVotingTrends] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [aggregatedVotes, setAggregatedVotes] = useState({}); // Add this line

  const fetchVotingTrends = (candidateId) => {
    const token = localStorage.getItem("token");
    // Adjust the URL based on whether a candidate is selected or not
    const url = candidateId
      ? `/elections/${id}/voting-trends/${candidateId}`
      : `/elections/${id}/voting-trends`;

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const formattedTrends = response.data.map((trend) => ({
          date: new Date(trend.date).toLocaleDateString("en-US"),
          totalVotes: trend.totalVotes,
        }));
        setVotingTrends(formattedTrends); // Debugging log
      })
      .catch((error) => console.log(error));
  };

  // When a candidate is selected, update the trends
  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidateId(candidateId);
    fetchVotingTrends(candidateId);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return;
    }

    // Fetch election details
    axios
      .get(`/elections/${id}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setElectionData(response.data); // Set the response data to state
      })
      .catch((error) => console.log(error));

    // Fetch voting trends
    axios
      .get(`/elections/${id}/voting-trends`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const formattedTrends = response.data.map((trend) => ({
          ...trend,
          date: new Date(trend.date).toLocaleDateString("en-US"), // Converts to MM/DD/YYYY format
          totalVotes: trend.totalVotes,
        }));

        setVotingTrends(formattedTrends); // Set the voting trends data to state
      })
      .catch((error) => console.log(error));

    axios
      .get(`/elections/${id}/voting-trends`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Voting Trends Data:", response.data); // Log the raw data

        const votesAggregation = response.data.reduce((acc, item) => {
          const candidateKey = item.candidateId; // Convert candidateId to string
          acc[candidateKey] = (acc[candidateKey] || 0) + item.totalVotes;
          return acc;
        }, {});

        setAggregatedVotes(votesAggregation);
        console.log("Aggregated Votes:", votesAggregation); // Log the aggregated votes
      })
      .catch((error) => console.log(error));

    axios
      .get(`/elections/${id}/aggregated-votes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAggregatedVotes(response.data); // Assuming response.data is an object with candidateId as keys and vote count as values
      })
      .catch((error) => console.log(error));
  }, [id]);

  if (!electionData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Election Details for ID: {id}</h1>
      <h2>Description: {electionData.description}</h2>
      <h2>Location: {electionData.location}</h2>
      <h2>Active: {electionData.active ? "Yes" : "No"}</h2>

      <h3>Election Results:</h3>
      {electionData.candidates.map((candidate, index) => {
        const candidateKey = candidate.candidateId.toString();
        const totalVotes = aggregatedVotes[candidateKey] || 0;
        return (
          <p key={index}>
            {candidate.firstname} {candidate.lastname} - {candidate.party}:{" "}
            {totalVotes} votes
          </p>
        );
      })}

      <CandidateSelector
        candidates={electionData.candidates}
        onSelectCandidate={handleSelectCandidate}
        selectedCandidateId={selectedCandidateId}
      />

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={votingTrends}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalVotes"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElectionDetails;
