import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent refresh while filling data
    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);

      if (!res.ok || data.success == false) {
        setError(true);
        return;
      }
      navigate("/sign-in");
    } catch (error) {
      console.log("error happened");
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="bg-slate-300 p-3 rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

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
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fullname" className="text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Full name"
            id="fullname"
            className="bg-slate-300 p-3 rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="bg-slate-300 p-3 rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            type="number"
            placeholder="Phone"
            id="phone"
            className="bg-slate-300 p-3 rounded-lg"
            onChange={handleChange}
            required
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
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmpassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirmpassword"
            className="bg-slate-300 p-3 rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-2"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>

      <p className="text-red-700 mt-5">{error && "Something went wrong"}</p>
    </div>
  );
};

export default Signup;
