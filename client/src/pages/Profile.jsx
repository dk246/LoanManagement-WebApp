import { useState, useEffect } from "react";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Load current user from local storage or your auth logic
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setCurrentUser(storedUser);
      setFormData({
        username: storedUser.username,
        email: storedUser.email,
        address: storedUser.address,
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpdateSuccess(false);
    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch(`/api/profile/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Update failed");
        setLoading(false);
        return;
      }

      setCurrentUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      setUpdateSuccess(true);
    } catch (err) {
      setError("Something went wrong!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentLoan");
    localStorage.removeItem("selectedRequest");
    window.location.href = "/"; // redirect to login page
  };

  if (!currentUser) return <div className="p-3">Loading profile...</div>;

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <img
          src={formData.profilePhoto || currentUser.profilePhoto}
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            value={formData.username || ""}
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-300 rounded-lg p-3"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            value={formData.email || ""}
            type="email"
            id="email"
            placeholder="Email"
            className="bg-slate-300 rounded-lg p-3"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <input
            value={formData.address || ""}
            type="text"
            id="address"
            placeholder="Address"
            className="bg-slate-300 rounded-lg p-3"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="New Password"
            className="bg-slate-300 rounded-lg p-3"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmpassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmpassword"
            placeholder="Confirm Password"
            className="bg-slate-300 rounded-lg p-3"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <button
          className="bg-red-400 text-white p-3 rounded-lg uppercase hover:opacity-95"
          onClick={handleLogout}
        >
          Sign out
        </button>
      </form>

      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">User is updated successfully!</p>
      )}
    </div>
  );
};

export default Profile;
