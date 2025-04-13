import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminRequest = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRequest = localStorage.getItem("selectedRequest");
    if (storedRequest) {
      setSelectedRequest(JSON.parse(storedRequest));
    }
  }, []);

  const handleApprove = async () => {
    if (!selectedRequest?.id) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/loan-status/${selectedRequest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setSelectedRequest((prev) => ({ ...prev, status: updated.status }));
      setMessage("Request approved successfully");
    } catch (error) {
      console.error(error);
      setMessage("Error approving request");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest?.id) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/loan-delete/${selectedRequest.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete request");

      setMessage("Request rejected and deleted");
      setTimeout(() => navigate("/admin-home"), 1000); // Navigate back to admin home
    } catch (error) {
      console.error(error);
      setMessage("Error rejecting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-sky-700 mb-6">
        Single Request Details
      </h2>

      {selectedRequest ? (
        <div className="grid gap-4">
          {Object.entries(selectedRequest)
            .filter(([key]) => key !== "id")
            .map(([key, value]) => (
              <div key={key}>
                <label className="block text-gray-600 mb-1 capitalize">
                  {key}
                </label>
                <input
                  value={value}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            ))}
        </div>
      ) : (
        <p className="text-gray-500">No request found.</p>
      )}

      <div className="flex justify-end gap-4 mt-6">
        {selectedRequest?.status !== "approved" && (
          <button
            disabled={loading}
            onClick={handleReject}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        )}

        <button
          disabled={loading || selectedRequest?.status === "approved"}
          onClick={handleApprove}
          className={`px-6 py-2 rounded-lg text-white 
      ${
        selectedRequest?.status === "approved"
          ? "bg-green-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      } 
      disabled:opacity-50`}
        >
          {selectedRequest?.status === "approved" ? "Approved" : "Approve"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm font-medium text-center text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default AdminRequest;
