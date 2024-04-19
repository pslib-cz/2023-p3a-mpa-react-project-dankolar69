
import { useContext, useEffect } from 'react';
import { GameContext } from '../providers/ContextProvider';
import '../styles/Shop.css';
import { Link } from 'react-router-dom';

const Shop = () => {
    const { state, dispatch } = useContext(GameContext);
    

    useEffect(() => {
        // Uložení upgradů do localStorage
        localStorage.setItem('upgrades', JSON.stringify(state.upgrades));
        localStorage.setItem('currency', JSON.stringify(state.currency));
    }, [state.upgrades, state.currency]);


    console.log('Shop state:', state);
    const handleBuyUpgrade = (upgradeIndex: number) => {
        const selectedUpgrade = state.upgrades[upgradeIndex];

        if (selectedUpgrade.owned) {
            console.log('Upgrade already owned:', selectedUpgrade.name);
            return;
        }

        if (state.currency >= selectedUpgrade.price && !selectedUpgrade.owned) {
            
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
            <div className="shop__bg">
                <div className="shop__container">
                    <h1 className="shop__title">Shop for upgrades</h1>
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
                    <Link to="/" className="link">
                        <button className="shop__back__button">
                            Back to menu
                        </button>
                    </Link>
                </div>
            </div>
        );
    
};

export default Shop;