import React from 'react';
import { redirect } from 'react-router-dom';

const withAuthenticated = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
      return <redirect to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthenticated;
