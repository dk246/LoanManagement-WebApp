import { Link } from "react-router-dom";

const Header = ({ currentUser }) => {
  const isAdmin = currentUser?.username === "Admin#19193@123";

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <Link to={isAdmin ? "/admin-home" : "/"}>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wider">
            Loan App
          </h1>
        </Link>
        <nav className="flex space-x-6">
          <Link
            to={isAdmin ? "/admin-home" : "/"}
            className="text-white hover:text-blue-300 transition"
          >
            Home
          </Link>
          {!currentUser && (
            <Link
              to="/sign-in"
              className="text-white hover:text-blue-300 transition"
            >
              Sign In
            </Link>
          )}
          {currentUser && (
            <Link
              to="/profile"
              className="text-white hover:text-blue-300 transition"
            >
              Profile
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
