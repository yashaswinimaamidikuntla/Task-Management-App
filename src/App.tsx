import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Homepage from "./pages/Homepage"; // Import the Homepage component
import Loginpage from "./pages/Loginpage"; // Import the Login component
import useAuthStore from './store/authStore.ts';
import { Loader } from 'lucide-react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const handleGoogleLogin = useAuthStore((state) => state.handleGoogleLogin);
  const handleLogout = useAuthStore((state) => state.handleLogout);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin w-10 h-10 text-gray-700" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Loginpage handleGoogleLogin={handleGoogleLogin} />} />
        <Route path="/home" element={<Homepage handleLogout={handleLogout} />} />
      </Routes>
      <ToastContainer
        toastStyle={{ backgroundColor: "black", color: "white" }}
      />
    </>
  );
};

export default App;