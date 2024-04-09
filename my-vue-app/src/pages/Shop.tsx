import React from 'react';
import { upgrades } from '../components/GameReducer';

const Shop = () => {

    
        const handleBuyUpgrade = (upgradeIndex: any) => {
            // Handle buying the upgrade here
            console.log('Buying upgrade:', upgrades[upgradeIndex]);
        };
    
        return (
            <div className="shop__container">
                <h1 className="title" style={{color:'black'}}>Shop for upgrades</h1>
                <div className="shop__list">
                    {upgrades.map((upgrade, index) => (
                        <div className="shop__item" key={index}>
                            <h2>{upgrade.name}</h2>
                            <p>Price: {upgrade.price}</p>
                            <button onClick={() => handleBuyUpgrade(index)}>Buy</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    
};

export default Shop;