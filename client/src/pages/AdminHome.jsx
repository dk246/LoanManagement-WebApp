import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminHome = () => {
  const [requestCards, setRequestCards] = useState([]);
  const [paymentCards, setPaymentCards] = useState([]);
  const [allPayments, setAllPayments] = useState([]); // NEW state
  const [activeTab, setActiveTab] = useState("requests");
  const navigate = useNavigate();

  const statusColors = {
    pending: "bg-yellow-200 text-yellow-800",
    approved: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
  };

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const res = await fetch("/api/admin/loan-requests");
        const data = await res.json();
        if (res.ok) {
          const formatted = data.map((item) => ({
            id: item._id,
            username: item.user.username || "Unknown User",
            address: item.user.address,
            phone: item.user.phone,
            date: new Date(item.createdAt).toLocaleDateString(),
            amount: item.amount,
            value: item.value,
            status: item.status,
          }));
          setRequestCards(formatted);
        }
      } catch (error) {
        console.error("Error fetching requests", error);
      }
    };

    const fetchPaymentHistory = async () => {
      try {
        const res = await fetch("/api/loan/payment-history");
        const data = await res.json();
        if (res.ok) {
          const pendingPayments = data
            .filter((p) => p.status === "pending")
            .map((item) => ({
              id: item._id,
              userId: typeof item.user === "object" ? item.user._id : item.user,
              name: item.user?.username || "Unknown User",
              amount: item.payment,
              date: new Date(item.createdAt).toLocaleDateString(),
              status: item.status,
            }));
          setPaymentCards(pendingPayments);
          setAllPayments(data); // NEW: store all payment data
        }
      } catch (error) {
        console.error("Error fetching payment history", error);
      }
    };

    fetchLoanRequests();
    fetchPaymentHistory();
  }, []);

  const handleShow = (card) => {
    localStorage.setItem("selectedRequest", JSON.stringify(card));
    navigate("/admin-request");
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/loan/payment-approve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (!res.ok) throw new Error("Failed to approve payment");
      setPaymentCards((prev) => prev.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/loan/payment-delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete payment");
      setPaymentCards((prev) => prev.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error rejecting payment:", error);
    }
  };

  // NEW: Build list of users from allPayments (not just pending)
  const uniqueUsers = Array.from(
    new Map(
      allPayments.map((item) => {
        const user = item.user || {};
        return [
          user._id || item.user,
          {
            userId: user._id || item.user,
            name: user.username || "Unknown User",
          },
        ];
      })
    ).values()
  );

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 space-y-8">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-2 font-semibold rounded-lg transition ${
            activeTab === "requests"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Loan Requests
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-6 py-2 font-semibold rounded-lg transition ${
            activeTab === "payments"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Payments Details
        </button>
      </div>

      {activeTab === "requests" && (
        <div className="grid gap-4">
          {requestCards.map((card) => (
            <div
              key={card.id}
              className="bg-amber-100 rounded-2xl shadow p-6 border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-sky-700">
                  {card.username}
                </h3>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    statusColors[card.status] || "bg-gray-200 text-gray-600"
                  }`}
                >
                  {card.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 mb-2">Date: {card.date}</p>
              <p className="text-gray-600 mb-2">Amount: Rs.{card.amount}</p>
              <p className="text-gray-600 mb-4">
                Witness Value: Rs.{card.value}
              </p>
              <button
                onClick={() => handleShow(card)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Show
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "payments" && (
        <div className="grid gap-4 ">
          {paymentCards.map((card) => (
            <div
              key={card.id}
              className="bg-amber-100 rounded-2xl shadow p-6 border border-gray-800"
            >
              <h3 className="text-xl font-bold text-sky-700 mb-2">
                {card.name}
              </h3>
              <p className="text-gray-600 mb-2">Amount: Rs.{card.amount}</p>
              <p className="text-gray-600 mb-4">Date: {card.date}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleApprove(card.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(card.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW Section: User Buttons for all payment users (pending + approved) */}
      <div className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-sky-800 mb-4">
          View Payments by User
        </h2>
        <div className="flex flex-wrap gap-4">
          {uniqueUsers.map((user) => (
            <button
              key={user.userId}
              onClick={() =>
                navigate("/user-payments", {
                  state: { userId: user.userId, name: user.name },
                })
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
