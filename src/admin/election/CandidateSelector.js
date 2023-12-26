import React from 'react';

const CandidateSelector = ({ candidates, onSelectCandidate }) => {
  return (
    <div>
      <label htmlFor="candidate-selector">Select Candidate: </label>
      <select id="candidate-selector" onChange={(e) => onSelectCandidate(e.target.value)}>
        <option value="">All</option>
        {candidates.map(candidate => (
          <option key={candidate.candidateId} value={candidate.candidateId}>
            {candidate.firstname} {candidate.lastname}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CandidateSelector;
