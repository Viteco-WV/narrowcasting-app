import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RoomBookingSystem from './pages/TVVL_RoomBookingSystem';
import EnvironmentalDashboard from './pages/TVVL_EnvironmentalDashboard';
import TvvlEnergyDashboard from './pages/TVVL_EnergyDashboard';
import TnEnergyDashboard from './pages/TN_EnergyDashboard';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tvvl-roombooking" element={<RoomBookingSystem />} />
          <Route path="/tvvl-enviromental" element={<EnvironmentalDashboard />} />
          <Route path="/tvvl-energy" element={<TvvlEnergyDashboard />} />
          <Route path="/tn-energy" element={<TnEnergyDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;