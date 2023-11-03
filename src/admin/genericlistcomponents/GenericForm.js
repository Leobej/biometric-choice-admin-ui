import React, { useState, useEffect } from 'react';

const GenericForm = ({ initialValues, onSubmit, fields }) => {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);  // Passes the form values to the parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ...rest of the form code */}
    </form>
  );
};

export default GenericForm;
