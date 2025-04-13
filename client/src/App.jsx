import { Router, BrowserRouter, Route, Routes, Links } from "react-router-dom";
import { useState, useEffect } from "react";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Header from "./components/Header";
import Signin from "./pages/SignIn";
import Profile from "./pages/Profile";
import LoanRequest from "./pages/LoanRequest";
import MyLoan from "./pages/MyLoan";
import AdminHome from "./pages/AdminHome";
import AdminRequest from "./pages/AdminRequest";
import AdminPayment from "./pages/AdminPayment";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentLoan, setCurrentLoan] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const storedLoan = JSON.parse(localStorage.getItem("currentLoan"));
    if (storedUser) setCurrentUser(storedUser);
    if (storedLoan) setCurrentLoan(storedLoan);
  }, []);

  return (
    <BrowserRouter>
      {/* Header */}
      <Header currentUser={currentUser} currentLoan={currentLoan} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              currentUser={currentUser}
              currentLoan={currentLoan}
              setCurrentLoan={setCurrentLoan}
            />
          }
        />
        {/* <Route path="/about" element={<About />} /> */}
        <Route
          path="/sign-in"
          element={
            <Signin
              setCurrentUser={setCurrentUser}
              setCurrentLoan={setCurrentLoan}
            />
          }
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/loan-request"
          element={<LoanRequest currentLoan={currentLoan} />}
        />
        <Route path="/my-loan" element={<MyLoan currentLoan={currentLoan} />} />

        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-request" element={<AdminRequest />} />
        <Route path="/user-payments" element={<AdminPayment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
