import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

const LoanRequest = ({ currentLoan }) => {
  const [formData, setFormData] = useState({
    witness: "",
    details: "",
    value: "",
    amount: "",
    interestRate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  useEffect(() => {
    const storedLoan = JSON.parse(localStorage.getItem("currentLoan"));
    if (storedLoan) {
      setFormData({
        witness: storedLoan.witness,
        details: storedLoan.details,
        value: storedLoan.value,
        amount: storedLoan.amount,
        interestRate: storedLoan.interestRate,
      });
    }
  }, []);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?._id;
  // const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setUpdateSuccess(false);
    const amount = parseFloat(formData.amount);
    const value = parseFloat(formData.value);
    if (amount > value) {
      setError("Loan amount cannot be greater than the value of the witness.");
      return;
    }
    try {
      const res = await fetch("/api/loan/loan-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId }), // attach userId here
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Request failed");
        return;
      }
      localStorage.setItem("currentLoan", JSON.stringify(data)); // <-- Save loan data
      setUpdateSuccess(true);
      window.location.href = "/";
    } catch (err) {
      setError("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto mt-14  ">
      <div className="bg-blue-200 rounded-3xl shadow-xl p-8 border">
        <h2 className="text-3xl font-bold mb-6 text-blue-800">
          Request a Loan
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs styled with consistent spacing and hover/focus animation */}
          <div>
            <label className="block text-gray-800 mb-1 font-medium">
              Type of the Collateral
            </label>
            <input
              id="witness"
              value={formData.witness}
              onChange={handleChange}
              type="string"
              placeholder="Land, Bike, Car, etc..."
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                currentLoan
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "focus:ring-blue-400"
              }`}
              required
              disabled={!!currentLoan}
            />
          </div>
          <div>
            <label className="block text-gray-800 mb-1 font-medium">
              Collateral details
            </label>
            <input
              id="details"
              value={formData.details}
              onChange={handleChange}
              type="string"
              placeholder="AAB-2345"
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                currentLoan
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "focus:ring-blue-400"
              }`}
              required
              disabled={!!currentLoan}
            />
          </div>
          <div>
            <label className="block text-gray-800 mb-1 font-medium">
              Value of the collateral
            </label>
            <input
              id="value"
              value={formData.value}
              onChange={handleChange}
              type="number"
              placeholder="Value of your witness"
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                currentLoan
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "focus:ring-blue-400"
              }`}
              required
              disabled={!!currentLoan}
            />
          </div>
          <div>
            <label className="block text-gray-800 mb-1 font-medium">
              Loan Amount you need
            </label>
            <input
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              type="number"
              placeholder="Enter amount"
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                currentLoan
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "focus:ring-blue-400"
              }`}
              required
              disabled={!!currentLoan}
            />
          </div>
          <div>
            <label className="block text-gray-800 mb-1 font-medium">
              Interest Rate (%)
            </label>
            <input
              id="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              type="number"
              placeholder="e.g. 7.5"
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                currentLoan
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "focus:ring-blue-400"
              }`}
              required
              disabled={!!currentLoan}
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white font-semibold text-lg rounded-xl py-3 transition-all ${
              currentLoan || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading || !!currentLoan}
          >
            {loading
              ? "Requesting..."
              : currentLoan
              ? "Already Requested"
              : "Request"}
          </button>
        </form>
        {updateSuccess && (
          <p className="text-green-600 mt-4">
            Loan request submitted successfully!
          </p>
        )}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoanRequest;
