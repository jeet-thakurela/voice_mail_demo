//frontend/src/components/layouts/MainLayout.jsx
import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { ThemeContext } from "../../contexts/ThemeContext";
import VoiceControl from '../common/VoiceControl';
import "../../styles/MainLayout.css";

const MainLayout = () => {
  const { darkMode } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <Header />
      <div className="layout-container">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content-area">
        <div className="voice-control-wrapper">
          <VoiceControl /> 
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
