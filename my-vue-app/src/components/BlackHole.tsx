import React from 'react';
import blackHole from '../assets/images/blackHole.png';

interface BlackHoleProps {
    size: number;
    position: { x: number; y: number };
}

const BlackHole: React.FC<BlackHoleProps> = ({ size, position }) => {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: 'black',
                position: 'absolute',
                left: position.x,
                top: position.y,
                transition: 'top 0.2s ease-out, left 0.2s ease-out'
            }}
            
        >
            <img src={blackHole} alt="black hole" style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default BlackHole;