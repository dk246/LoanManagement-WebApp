import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ currentUser, currentLoan, setCurrentLoan }) => {
  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const userId = currentUser?._id;
        if (!userId) return;

        const res = await fetch(`/api/loan/user/${userId}`);
        if (!res.ok) {
          console.error("Loan fetch failed with status:", res.status);
          return;
        }

        const data = await res.json();
        localStorage.setItem("currentLoan", JSON.stringify(data));
        setCurrentLoan(data);
      } catch (err) {
        console.error("Failed to fetch current loan:", err);
      }
    };

    fetchLoan();
  }, [currentUser, setCurrentLoan]);

  return (
    <div className="p-4 mt-10 max-w-4xl mx-auto space-y-8">
      <div className="rounded-3xl border bg-blue-200 shadow-xl">
        <div className="p-6 sm:p-10 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-800">
            Loan Application Guidelines
          </h2>
          <ol className="list-decimal list-inside text-blue-800 space-y-2 text-base sm:text-lg">
            <li>Please provide true details when you ask for a loan.</li>
            <li>Double-check your details before submitting.</li>
            <li>Remember your password.</li>
          </ol>
          {currentUser ? (
            <Link to="/loan-request">
              <button className="w-full bg-green-600 text-white text-lg font-semibold rounded-xl py-3 mt-4 hover:bg-green-700 transition">
                {!currentLoan ? "Ask for a Loan" : "View details"}
              </button>
            </Link>
          ) : (
            <Link to="/sign-in">
              <button className="w-full bg-green-600 text-white text-lg font-semibold rounded-xl py-3 mt-4 hover:bg-green-700 transition">
                Ask for a Loan
              </button>
            </Link>
          )}
        </div>
      </div>

      {currentLoan && currentLoan.status === "approved" && (
        <div className="rounded-3xl border bg-blue-100 shadow-xl">
          <div className="p-6 sm:p-10 space-y-4">
            <h2 className="text-2xl font-semibold text-blue-800">
              Loan Repayment Guidelines
            </h2>
            <ol className="list-decimal list-inside text-blue-800 space-y-2 text-base sm:text-lg">
              <li>Please pay the money before the deadline.</li>
              <li>Send request when you pay the money.</li>
              <li>Remember your password.</li>
            </ol>
            <Link to="/my-loan">
              <button className="w-full bg-green-600 text-white text-lg font-semibold rounded-xl py-3 mt-4 hover:bg-green-700 transition">
                My Loan Details
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
