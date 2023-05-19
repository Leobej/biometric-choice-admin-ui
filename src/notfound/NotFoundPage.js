import React from 'react';
import { useNavigate } from 'react-router';

function NotFoundPage() {
const navigate=useNavigate();
    return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <h1>404 - Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      <div>
        <button
        onClick={()=>navigate("/login")} 
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
           Go back to Login
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
