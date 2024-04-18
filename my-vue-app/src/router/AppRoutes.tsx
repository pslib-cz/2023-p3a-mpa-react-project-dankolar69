
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  MainMenu  from '../pages/MainMenu';
import GamePlay  from '../pages/Gameplay';
import App from '../App';
import Victory from '../pages/Victory';
import BossFight from '../pages/BossFight';
import DeadScreen from '../pages/DeadScreen';
import Shop from '../pages/Shop';
import Ranking from '../pages/Ranking';



const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<MainMenu />} />
        <Route path="/app" element={<App />} />
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path='/victory' element={<Victory />} />
        <Route path='/boss' element={<BossFight />} />
        <Route path='/dead' element={<DeadScreen />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/ranking' element={<Ranking />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;