// src/components/LudoBoard.js
import React, { useState } from 'react';
import BoardComponent from './BoardComponent';
import redPlayerContext from '../context/RedPlayerContext';
import diceContext from '../context/DiceContext';
const LudoBoard = () => {
    const [diceValue, setDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [movement, setMovement] = useState(false)
    const [redPlayerTokensPosi,setRedPlayerTokensPosi] = useState([
        [11,2],
        [11,3],
        [12,2],
        [12,3]
    ])
    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);
        const newValue = Math.floor(Math.random() * 6) + 1;
        setTimeout(() => {
            setDiceValue(4);
            setIsRolling(false);
            setMovement(true);
        }, 500);
    };
    // Dice face render function
    const renderDiceFace = () => {
        switch (diceValue) {
            case 1: return <div className="dot center"></div>;
            case 2: return <><div className="dot top-left"></div><div className="dot bottom-right"></div></>;
            case 3: return <><div className="dot top-left"></div><div className="dot center"></div><div className="dot bottom-right"></div></>;
            case 4: return <><div className="dot top-left"></div><div className="dot top-right"></div><div className="dot bottom-left"></div><div className="dot bottom-right"></div></>;
            case 5: return <><div className="dot top-left"></div><div className="dot top-right"></div><div className="dot center"></div><div className="dot bottom-left"></div><div className="dot bottom-right"></div></>;
            case 6: return <><div className="dot top-left"></div><div className="dot top-right"></div><div className="dot middle-left"></div><div className="dot middle-right"></div><div className="dot bottom-left"></div><div className="dot bottom-right"></div></>;
            default: return null;
        }
    };
    return (

        <diceContext.Provider value={{diceValue,movement,setMovement}}>
        <redPlayerContext.Provider value={{redPlayerTokensPosi,setRedPlayerTokensPosi}}>
            <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                <div className="flex justify-center items-center mb-4">
                    <div className={`dice ${isRolling ? 'rolling' : ''}`}>
                        {renderDiceFace()}
                    </div>
                    <button
                        onClick={rollDice}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={isRolling}
                    >
                        Roll Dice
                    </button>
                </div>
                <BoardComponent />
            </div>
        </redPlayerContext.Provider>
        </diceContext.Provider>
    );
};

export default LudoBoard;
