import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import UserMain from "./pages/user/UserMain";
import { websocketService } from "./services/websocket/websocketService";
import { initializeWebSocket } from "./services/websocket/websocketConfig";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import AdminMain from "./pages/admin/AdminMain";

const App: React.FC = () => {
  const { isAuthenticated: isUserAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { isAuthenticated: isAdminAuthenticated } = useSelector(
    (state: RootState) => state.adminAuth
  );
  
  useEffect(() => {
    const initWS = async () => {
      try {
        const serverUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_URL;
        await initializeWebSocket(serverUrl);
      } catch (error) {
        console.error("Failed to connect to Socket.IO:", error);
      }
    };

    if (isAdminAuthenticated || isUserAuthenticated) {
      initWS();
    }
    return () => {
      websocketService.disconnect();
    };
  }, [isAdminAuthenticated, isUserAuthenticated]);

  return (
    <div>
      <Routes>
        <Route path="/user/:sessionId/*" element={<UserMain />} />
        <Route path="/user/*" element={<UserMain />} />
        <Route path="/admin/:sessionId/*" element={<AdminMain />} />
        <Route path="/admin/*" element={<AdminMain />} />
        <Route path="/" element={<Navigate to="/user" replace />} />
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </div>
  );
};

export default App;
