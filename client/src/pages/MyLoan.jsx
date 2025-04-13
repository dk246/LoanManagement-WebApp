import React, { useEffect, useState } from "react";

const MyLoan = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [payAmount, setPayAmount] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [monthlyInterest, setMonthlyInterest] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [dueDate, setDueDate] = useState(new Date());

  const currentLoan = JSON.parse(localStorage.getItem("currentLoan"));
  const currentUserId = currentLoan.user; // assuming currentLoan.user stores the current user's id

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all payment history from backend
        const res = await fetch("/api/loan/payment-history");
        const data = await res.json();
        // Filter payment history to include only the current user's payments
        const userData = data.filter((p) => {
          // p.user might be a string or an object (if populated)
          if (typeof p.user === "object") {
            return p.user._id === currentUserId;
          }
          return p.user === currentUserId;
        });
        // Reverse so that the most recent payment is at index 0
        const sortedHistory = userData.reverse();
        setPaymentHistory(sortedHistory);

        const baseAmount = currentLoan.amount;
        const interestRate = currentLoan.interestRate;
        const baseInterest = (baseAmount * interestRate) / 100;
        const latest = sortedHistory[0];

        // Determine reference date for cycle calculations:
        // If there is a payment history, use the createdAt of the latest payment,
        // Otherwise, use the loan's createdAt date.
        const lastPaymentDate = latest
          ? new Date(latest.createdAt)
          : new Date(currentLoan.createdAt);
        const currentDate = new Date();

        // Calculate the current remaining amount:
        // If the user has payments, use the nowamount from the latest payment; otherwise the original amount.
        const nowAmount =
          sortedHistory.length > 0 ? latest.nowamount : baseAmount;

        // Determine if a new monthly cycle has begun by comparing the month of currentDate and lastPaymentDate.
        if (
          currentDate.getMonth() !== lastPaymentDate.getMonth() ||
          currentDate.getFullYear() !== lastPaymentDate.getFullYear()
        ) {
          // New cycle:
          // If there is any unpaid interest from the last cycle, add it to the remaining amount.
          const lastInterest = latest?.monthlyInterest ?? baseInterest;
          const updatedRemaining =
            lastInterest > 0 ? nowAmount + lastInterest : nowAmount;
          setRemainingAmount(updatedRemaining);
          // Recalculate monthly interest based on the updated remaining amount.
          setMonthlyInterest((updatedRemaining * interestRate) / 100);
          // Set dueDate as one month after the last payment date (for simplicity)
          const newDue = new Date(lastPaymentDate);
          newDue.setMonth(newDue.getMonth() + 1);
          setDueDate(newDue);
        } else {
          // Same cycle, so just use the latest values.
          setRemainingAmount(nowAmount);
          setMonthlyInterest(
            latest?.monthlyInterest ?? (nowAmount * interestRate) / 100
          );
          setDueDate(lastPaymentDate);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    fetchData();
  }, [payStatus, currentLoan, currentUserId]);

  const handlePay = async () => {
    if (!payAmount || isNaN(payAmount)) return;

    const paymentValue = parseFloat(payAmount);
    let updatedInterest = monthlyInterest;
    let newRemaining = remainingAmount;

    if (paymentValue < updatedInterest) {
      // Only reduce the monthly interest.
      updatedInterest -= paymentValue;
    } else {
      // Payment covers monthly interest; extra reduces loan.
      const extra = paymentValue - updatedInterest;
      newRemaining = Math.max(0, newRemaining - extra);
      updatedInterest = 0;
    }

    const paymentData = {
      nowamount: newRemaining,
      payment: paymentValue,
      userId: currentLoan.user,
      loanId: currentLoan._id,
      monthlyInterest: updatedInterest,
    };

    setPayStatus("pending");

    await fetch("/api/loan/payment-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    setPayAmount("");
    setPayStatus("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-14 space-y-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Loan</h2>

      <div className="bg-amber-600  rounded-2xl shadow-md p-6 border text-white mb-6">
        <h3 className="text-xl font-black mb-4 ">Loan Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <span className="font-medium  ">Monthly Interest:</span> Rs.{" "}
            {monthlyInterest !== null
              ? Number(monthlyInterest).toFixed(2)
              : "Loading..."}
          </p>
          <p>
            <span className="font-medium">Remaining Loan:</span> Rs.{" "}
            {parseInt(Number(remainingAmount).toFixed(2))}
          </p>
          <p>
            <span className="font-medium">Due Date:</span>{" "}
            {dueDate ? dueDate.toDateString() : "Loading..."}
          </p>
        </div>

        <div className="mt-6">
          <input
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            placeholder="Enter amount"
            className="border px-3 py-2 rounded mr-2 text-white font-bold"
          />
          {(() => {
            // Disable the pay button if the latest payment of the current user is pending or if processing.
            const latestPayment = paymentHistory[0];
            const isLastPending = latestPayment?.status === "pending";
            const isButtonDisabled = isLastPending || payStatus === "pending";

            return (
              <button
                onClick={handlePay}
                disabled={isButtonDisabled}
                className={`${
                  isButtonDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-white hover:bg-orange-100"
                } text-orange-500 font-semibold py-2 px-6 my-2 rounded-lg transition`}
              >
                {isLastPending
                  ? "Waiting for Approval"
                  : payStatus === "pending"
                  ? "Processing..."
                  : "Pay"}
              </button>
            );
          })()}
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-2">Payment History</h2>
      <ul className="border rounded-lg p-4 space-y-2">
        {paymentHistory.length === 0 && (
          <p className="text-gray-600 border">No payment history found.</p>
        )}
        {paymentHistory.map((p, index) => (
          <li
            key={p._id || index}
            className="flex justify-between items-center border-b-1 p-1"
          >
            <span>{new Date(p.createdAt).toLocaleDateString("en-US")}</span>
            <span>Rs. {p.payment}</span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                p.status === "pending"
                  ? "bg-yellow-300"
                  : p.status === "approved"
                  ? "bg-green-300"
                  : "bg-red-300"
              }`}
            >
              {p.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyLoan;
