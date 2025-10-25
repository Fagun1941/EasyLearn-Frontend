import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DetailsError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const log = location.state;

  if (!log) {
    return (
      <div className="p-4">
        <p>No log details found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded mt-3"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Error Details</h2>
      <div className="border p-4 rounded bg-gray-50">
        <p><strong>Time:</strong> {new Date(log.timeStamp).toLocaleString()}</p>
        <p><strong>Level:</strong> {log.level}</p>
        <p><strong>Message:</strong> {log.message}</p>
        <p><strong>Log Guid:</strong> {log.logGuid}</p>
        <div className="mt-4">
          <strong>Exception:</strong>
          <pre className="bg-gray-100 p-2 rounded overflow-auto whitespace-pre-wrap">
            {log.exception || "No exception details available."}
          </pre>
        </div>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-600 text-white px-4 py-2 rounded mt-4 hover:bg-gray-700"
      >
        Back
      </button>
    </div>
  );
};

export default DetailsError;
