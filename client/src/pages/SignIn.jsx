import { useState } from "react";
import { Link } from "react-router-dom";

const Signin = ({ setCurrentUser, setCurrentLoan }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      console.log("Response data:", data);

      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(true);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data));

      if (data.loan) {
        localStorage.setItem("currentLoan", JSON.stringify(data.loan)); // <-- Restore loan
        setCurrentLoan(data.loan);
      }
      setCurrentUser(data);
      if (data.username == "Admin#19193@123") {
        window.location.href = "/admin-home";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.log("Error happened:", error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-300 p-3 rounded-lg"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-slate-300 p-3 rounded-lg"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-2"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>

      <p className="text-red-700 mt-5">{error && "Something went wrong"}</p>
    </div>
  );
};

export default Signin;
