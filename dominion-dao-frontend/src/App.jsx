import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import {
  getInfo,
  getProposals,
  isWallectConnected,
} from "./Blockchain.services";

import Header from "./components/Header";
import Home from "./views/Home";
import Proposal from "./views/Proposal";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        await isWallectConnected();

        await Promise.all([getInfo(), getProposals()]);
      } catch (error) {
        console.error("DAO initialization failed:", error);

        if (!cancelled) {
          setLoadError(error.message || "Failed to load DAO data");
        }
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#212936] dark:text-gray-300">
      <Header />

      {loadError && <p className="p-4 text-red-600">{loadError}</p>}

      {loaded ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proposal/:id" element={<Proposal />} />
        </Routes>
      ) : (
        <p className="p-8">Loading DominionDAO...</p>
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
