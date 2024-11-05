// src/components/LudoBoard.js
import React, { useState } from 'react';
import BoardComponent from './BoardComponent';
import redPlayerContext from '../context/RedPlayerContext';
import greenPlayerContext from '../context/GreenPlayerContext';
import diceContext from '../context/DiceContext';
import gameInfoContext from '../context/GameInfoContext';
import { countEqualElements } from '../utils/Utils';
import { initialTokensPositions,greenInitialTokenPositions } from '../utils/Paths';

const LudoBoard = () => {
    const [diceValue, setDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [movement, setMovement] = useState(false);
    const [numberOfPlayer, setNumberOfPlayers] = useState(2);
    const [playerTurn, setPlayerTurn] = useState(0);
    const [redPlayerTokensPosi, setRedPlayerTokensPosi] = useState([
        [11, 2],
        [11, 3],
        [12, 2],
        [12, 3]
    ])
    const [greenPlayerTokensPosi, setGreenPlayerTokensPosi] = useState([
        [2, 2],
        [2, 3],
        [3, 2],
        [3, 3]
    ])
    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);
        const newValue = Math.floor(Math.random() * 6) + 1;
        // const newValue = 5;
        setTimeout(() => {
            setDiceValue(newValue);
            setIsRolling(false);
            setMovement(true);
            if(playerTurn==0){
                let count=countEqualElements(redPlayerTokensPosi,initialTokensPositions);
                if(count == 4 && newValue!=6)
                    setPlayerTurn((playerTurn+1)%numberOfPlayer);
            }
            else if(playerTurn==1){
                let count=countEqualElements(greenPlayerTokensPosi,greenInitialTokenPositions);
                if(count == 4 && newValue!=6)
                    setPlayerTurn((playerTurn+1)%numberOfPlayer);
            }
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
        <gameInfoContext.Provider value={{ numberOfPlayer, setNumberOfPlayers, playerTurn, setPlayerTurn }}>
            <diceContext.Provider value={{ diceValue, movement, setMovement }}>
                <greenPlayerContext.Provider value={{ greenPlayerTokensPosi, setGreenPlayerTokensPosi }}>
                    <redPlayerContext.Provider value={{ redPlayerTokensPosi, setRedPlayerTokensPosi }}>
                        <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                            <div className="flex justify-center items-center mb-4">
                                <div
                                    className={`dice ${isRolling ? 'rolling' : ''}`}
                                    style={{
                                        backgroundColor:
                                            playerTurn === 0
                                                ? 'red'
                                                : playerTurn === 1
                                                    ? 'green'
                                                    : playerTurn === 2
                                                        ? 'yellow'
                                                        : 'blue',
                                    }}
                                >
                                    {renderDiceFace()}
                                </div>
                                <button
                                    onClick={rollDice}
                                    className="ml-4 px-4 py-2 bg-black text-white rounded"
                                    disabled={isRolling}
                                >
                                    Roll Dice
                                </button>
                            </div>
                            <BoardComponent />
                        </div>
                    </redPlayerContext.Provider>
                </greenPlayerContext.Provider>
            </diceContext.Provider>
        </gameInfoContext.Provider>
    );
};

export default LudoBoard;
