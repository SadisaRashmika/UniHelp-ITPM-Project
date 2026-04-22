import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const lectureDashboard1 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new Overview component
    navigate("/academic-ticket/lec-dashboard/overview");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default lectureDashboard1;
