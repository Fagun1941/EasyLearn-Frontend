import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./ErrorPage.css"; 
import api from './../../api/axiosConfig';

const ErrorPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get(
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

      <div className="max-h-[70vh] overflow-y-auto border rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="border px-2 py-1 w-1/12">Time</th>
              <th className="border px-2 py-1 w-1/12">Level</th>
              <th className="border px-2 py-1 w-3/12">Message</th>
              <th className="border px-2 py-1 w-3/12">Exception</th>
              <th className="border px-2 py-1 w-2/12">Log Guid</th>
              <th className="border px-2 py-1 w-2/12">Action</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.logGuid}>
                <td className="border px-2 py-1">
                  {new Date(log.timeStamp).toLocaleString()}
                </td>
                <td className="border px-2 py-1">{log.level}</td>
                <td className="border px-2 py-1 truncate-2-lines">{log.message}</td>
                <td className="border px-2 py-1">
                  <pre className="whitespace-pre-wrap max-h-12 overflow-hidden text-ellipsis">
                    {log.exception}
                  </pre>
                </td>
                <td className="border px-2 py-1">{log.logGuid}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() =>
                      navigate(`/error-details/${log.logGuid}`, { state: log })
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default ErrorPage;
