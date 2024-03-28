
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  MainMenu  from '../components/MainMenu';
import GamePlay  from '../components/Gameplay';
import App from '../App';
import Victory from '../components/Victory';
import BossFight from '../components/BossFight';


const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<MainMenu />} />
        <Route path="/app" element={<App />} />
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path='/victory' element={<Victory />} />
        <Route path='/boss' element={<BossFight />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;