import React from "react";
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col">

      <header className="w-full shadow-md py-8 px-6 flex justify-between items-center animate-fade-in-down">
      
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 animate-fade-in">
            📊 Welcome to Report Tracker
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 animate-fade-in delay-150">
            Your one-stop dashboard for inspection reports.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out animate-fade-in delay-300"
          >
            Click Here
          </button>
        </div>
      </main>
    </div>
  );
};

export default FrontPage;
