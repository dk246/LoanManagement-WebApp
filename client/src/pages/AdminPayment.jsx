import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AdminUserPayments = () => {
  const { state } = useLocation();
  const { userId, name } = state || {};
  const [historyData, setHistoryData] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loanSummary, setLoanSummary] = useState(null); // to store nowamount and monthlyInterest

  useEffect(() => {
    const fetchUserPaymentHistory = async () => {
      try {
        const res = await fetch("/api/loan/payment-history");
        const data = await res.json();
        if (res.ok) {
          // Filter payment history for the given userId
          const filtered = data.filter((p) => {
            if (typeof p.user === "object") return p.user._id === userId;
            return p.user === userId;
          });
          // Reverse to have latest payment first
          const sorted = filtered.reverse();
          setHistoryData(sorted);
          // If available, take user details from the first record's populated user object
          if (sorted.length > 0 && typeof sorted[0].user === "object") {
            setUserDetails(sorted[0].user);
            // Use latest payment record for summary details
            setLoanSummary({
              nowamount: sorted[0].nowamount,
              monthlyInterest: sorted[0].monthlyInterest,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user payment history:", error);
      }
    };

    if (userId) {
      fetchUserPaymentHistory();
    }
  }, [userId]);

  return (
    <div className="p-6 max-w-4xl mx-auto mt-10 space-y-8">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">
        Payment History for {name}
      </h2>

      {historyData.length === 0 ? (
        <p className="text-gray-600">No payment history found for this user.</p>
      ) : (
        <ul className="bg-amber-100 rounded-xl border shadow p-6 space-y-3 divide-y divide-gray-700">
          {historyData.map((p, index) => (
            <li
              key={p._id || index}
              className="flex justify-between items-center py-2"
            >
              <span className="text-gray-700">
                {new Date(p.createdAt).toDateString()}
              </span>
              <span className="text-blue-600 font-semibold">
                Rs. {p.payment}
              </span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  p.status === "pending"
                    ? "bg-yellow-300 text-yellow-900"
                    : p.status === "approved"
                    ? "bg-green-300 text-green-900"
                    : "bg-red-300 text-red-900"
                }`}
              >
                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* User Details Section */}
      {userDetails && (
        <div className="mt-10 bg-amber-100 border rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-indigo-800 mb-4">
            User Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
            <div>
              <p>
                <span className="font-semibold">Username:</span>{" "}
                {userDetails.username}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {userDetails.email || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {userDetails.address || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {userDetails.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loan Summary Section from Payment Data */}
      {loanSummary && (
        <div className="mt-10 bg-amber-100 rounded-xl border shadow-lg p-6">
          <h3 className="text-2xl font-bold text-indigo-800 mb-4">
            Loan Summary for {name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
            <p>
              <span className="font-semibold">Now Amount:</span> Rs.{" "}
              {parseInt(loanSummary.nowamount)}
            </p>
            <p>
              <span className="font-semibold">Monthly Interest:</span> Rs.{" "}
              {loanSummary.monthlyInterest}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserPayments;
