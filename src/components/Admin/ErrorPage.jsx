import React, { useEffect, useState } from "react";
import axios from "axios";

const ErrorPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          "https://localhost:44389/api/Logs/errors?top=50"
        );
        setLogs(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Error Logs</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">Level</th>
            <th className="border px-2 py-1">Message</th>
            <th className="border px-2 py-1">Exception</th>
            <th className="border px-2 py-1">Log Guid</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.logGuid}>
              <td className="border px-2 py-1">
                {new Date(log.timeStamp).toLocaleString()}
              </td>
              <td className="border px-2 py-1">{log.level}</td>
              <td className="border px-2 py-1">{log.message}</td>
              <td className="border px-2 py-1">
                <pre className="whitespace-pre-wrap">{log.exception}</pre>
              </td>
              <td className="border px-2 py-1">{log.logGuid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorPage;
