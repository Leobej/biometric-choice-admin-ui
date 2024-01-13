import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CandidateSelector from "./CandidateSelector"; // Ensure this component exists
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
  });

  const [votingTrends, setVotingTrends] = useState([]);
  const [votesByCandidate, setVotesByCandidate] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);

  const fetchVotingTrends = (candidateId) => {
    const token = localStorage.getItem("token");
    const baseUrl = `/elections/${id}/voting-trends`;
    const url = candidateId ? `${baseUrl}/${candidateId}` : baseUrl;

    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const formattedTrends = response.data.map((trend) => ({
          date: new Date(trend.date).toLocaleDateString("en-US"),
          totalVotes: trend.totalVotes,
          candidateId: trend.candidateIdResult,
        }));
        setVotingTrends(formattedTrends);
      })
      .catch((error) => console.log(error));
  };

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidateId(candidateId);
    fetchVotingTrends(candidateId);
  };
  
  const handleDeviceSelectionChange = (device) => {
    // Update selected devices
    setSelectedDevices((prevSelected) => {
      if (prevSelected.includes(device.id)) {
        return prevSelected.filter((d) => d !== device.id);
      } else {
        return [...prevSelected, device.id];
      }
    });
  };

  useEffect(() => {
    const newTotalVotes = Object.values(votesByCandidate).reduce(
      (acc, current) => acc + current,
      0
    );
    setTotalVotes(newTotalVotes);
  }, [votesByCandidate]);

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
        setElectionData(response.data);

        // Fetch aggregated votes for all candidates
        return axios.get(`/elections/${id}/aggregated-votes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((response) => {
        const initialVotesByCandidate = response.data.reduce((acc, current) => {
          acc[current.candidateId] = current.voteCount;
          return acc;
        }, {});
        setVotesByCandidate(initialVotesByCandidate);

        // Fetch overall voting trends
        return axios.get(`/elections/${id}/voting-trends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((response) => {
        const trendsData = response.data;
        const formattedTrends = trendsData.map((trend) => {
          const date = new Date(trend.date).toLocaleDateString("en-US");
          return {
            date: date,
            totalVotes: trend.totalVotes,
            candidateId: trend.candidateIdResult,
          };
        });
        setVotingTrends(formattedTrends);
      })
      .catch((error) => console.error(error));
  }, [id]);

  useEffect(() => {
    // Fetch all devices
    const fetchDevices = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8080/devices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  if (!electionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Election Details for ID: {id}
      </h1>
      <div className="mb-4">
        <p className="text-lg">
          <strong>Description:</strong> {electionData.description}
        </p>
        <p className="text-lg mb-6">
          <strong>Active:</strong> {electionData.active ? "Yes" : "No"}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Total Votes: {totalVotes}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {electionData.candidates.map((candidate, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 text-center"
            >
              <h4 className="font-bold text-lg mb-2">
                {candidate.firstname} {candidate.lastname}
              </h4>
              <p className="text-md mb-2">Party: {candidate.party}</p>
              <p className="text-md font-semibold">
                Votes: {votesByCandidate[candidate.candidateId] || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <CandidateSelector
          candidates={electionData.candidates}
          onSelectCandidate={handleSelectCandidate}
          selectedCandidateId={selectedCandidateId}
        />
      </div>

      <div className="mb-8">
        <ResponsiveContainer width="100%" height={400}>
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
    </div>
  );
};

export default ElectionDetails;
