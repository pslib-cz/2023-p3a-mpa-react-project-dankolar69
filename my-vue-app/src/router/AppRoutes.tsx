
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import  MainMenu  from '../pages/MainMenu';
import GamePlay  from '../pages/Gameplay';
import App from '../App';
import Victory from '../pages/Victory';
import BossFight from '../pages/BossFight';
import DeadScreen from '../pages/DeadScreen';
import Shop from '../pages/Shop';
import Ranking from '../pages/Ranking';
import BossFight2 from '../pages/BossFight2';



const AppRoutes: React.FC = () => {
  return (
    
      <Routes>
        
        <Route path="/" element={<MainMenu />} />
        <Route path="/app" element={<App />} />
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path='/victory' element={<Victory />} />
        <Route path='/boss' element={<BossFight />} />
        <Route path='/boss2' element={<BossFight2 />} />
        <Route path='/dead' element={<DeadScreen />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/ranking' element={<Ranking />} />
      </Routes>
  
  );
};

export default AppRoutes;