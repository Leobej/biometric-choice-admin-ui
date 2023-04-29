import React, { useState } from "react";

const CreateCandidateForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // do something with the form data
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Candidate Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="image">Candidate Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(event) => setImage(event.target.files[0])}
          required
        />
      </div>
      <button type="submit">Create Candidate</button>
    </form>
  );
};

export default CreateCandidateForm;
