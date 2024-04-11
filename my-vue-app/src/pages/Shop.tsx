import React from 'react';
import { upgrades } from '../reducers/GameReducer';
import { useContext } from 'react';
import { GameContext } from '../providers/ContextProvider';
import '../styles/Gameplay.css';

const Shop = () => {
    const { state, dispatch } = useContext(GameContext);
    
    console.log('Shop state:', state);
    const handleBuyUpgrade = (upgradeIndex: number) => {
        const selectedUpgrade = state.upgrades[upgradeIndex];

        if (selectedUpgrade.owned) {
            console.log('Upgrade already owned:', selectedUpgrade.name);
            return;
        }

        if (state.currency >= selectedUpgrade.price && !selectedUpgrade.owned) {
            // Dispatch action to purchase upgrade
            dispatch({
                type: 'PURCHASE_UPGRADE',
                payload: { upgradeIndex, price: selectedUpgrade.price }
            });

            console.log('Upgrade purchased:', selectedUpgrade.name);
        } else {
            console.log('Not enough currency to buy:', selectedUpgrade.name);
        }
    };
    
        return (
            <div className="shop__container">
                <h1 className="title" style={{color:'black'}}>Shop for upgrades</h1>
                <p>Current currency: {state.currency}</p>
                <div className="shop__list">
                    {state.upgrades.map((upgrade, index) => (
                        <div className="shop__item" key={index}>
                            <h2>{upgrade.name}</h2>
                            <p>Price: {upgrade.price}</p>
                            <button onClick={() => handleBuyUpgrade(index) } disabled={upgrade.owned}>Buy</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    
};

export default Shop;