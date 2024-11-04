// src/components/LudoBoard.js
import React, { useState } from 'react';

const LudoBoard = () => {
    const size = 15;
    const [diceValue, setDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [tokenIndex, setTokenIndex] = useState(0);

    // Define the specific path for the red player's movement
    const path = [
        { row: 8, col: 0 }, { row: 7, col: 0 }, { row: 6, col: 0 },
        { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 }, { row: 6, col: 4 }, { row: 6, col: 5 },
        { row: 5, col: 6 }, { row: 4, col: 6 }, { row: 3, col: 6 }, { row: 2, col: 6 }, { row: 1, col: 6 }, { row: 0, col: 6 },
        { row: 0, col: 7 }, { row: 0, col: 8 }, { row: 1, col: 8 }, { row: 2, col: 8 }, { row: 3, col: 8 }, { row: 4, col: 8 },
        { row: 5, col: 8 }, { row: 6, col: 9 }, { row: 6, col: 10 }, { row: 6, col: 11 }, { row: 6, col: 12 }, { row: 6, col: 13 }, { row: 6, col: 14 },
        { row: 7, col: 14 }, { row: 8, col: 14 }, { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 }, { row: 8, col: 10 }, { row: 8, col: 9 },
        { row: 9, col: 8 }, { row: 10, col: 8 }, { row: 11, col: 8 }, { row: 12, col: 8 }, { row: 13, col: 8 }, { row: 14, col: 8 },
        { row: 14, col: 7 }, { row: 14, col: 6 }, { row: 13, col: 6 }, { row: 12, col: 6 }, { row: 11, col: 6 }, { row: 10, col: 6 }, { row: 9, col: 6 },
        { row: 8, col: 5 }, { row: 8, col: 4 }, { row: 8, col: 3 }, { row: 8, col: 2 }, { row: 8, col: 1 }
    ];

    // Function to roll the dice
    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);
        const newValue = Math.floor(Math.random() * 6) + 1;
        setTimeout(() => {
            setDiceValue(newValue);
            setIsRolling(false);
            animateTokenMovement(newValue);
        }, 500);
    };

    // Animate token movement along the path
    const animateTokenMovement = (steps) => {
        let step = 0;

        const moveStepByStep = () => {
            if (step < steps) {
                setTokenIndex((prevIndex) => Math.min(prevIndex + 1, path.length - 1));
                step++;
                setTimeout(moveStepByStep, 300); // Adjust delay for animation speed
            }
        };

        moveStepByStep();
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

    const renderBoard = () => {
        let board = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cellClass = 'h-8 w-8 flex items-center justify-center';

                // Define player zones in corners
                if (i < 6 && j < 6) cellClass += ' bg-green-500';
                else if (i < 6 && j >= 9) cellClass += ' bg-yellow-400';
                else if (i >= 9 && j < 6) cellClass += ' bg-red-500';
                else if (i >= 9 && j >= 9) cellClass += ' bg-blue-500';

                // Center cells with different colors
                else if (i >= 6 && i <= 8 && j >= 6 && j <= 8) {
                    if (i === 6 && j === 6) cellClass += ' bg-green-500';
                    else if (i === 6 && j === 7) cellClass += ' bg-yellow-400';
                    else if (i === 6 && j === 8) cellClass += ' bg-red-500';
                    else if (i === 7 && j === 6) cellClass += ' bg-blue-500';
                    else if (i === 7 && j === 7) cellClass += ' bg-gray-300';
                    else if (i === 7 && j === 8) cellClass += ' bg-green-500';
                    else if (i === 8 && j === 6) cellClass += ' bg-yellow-400';
                    else if (i === 8 && j === 7) cellClass += ' bg-red-500';
                    else if (i === 8 && j === 8) cellClass += ' bg-blue-500';
                } else {
                    cellClass += ' bg-gray-300 border';
                }

                // Render token if its position matches the path cell
                const isTokenPosition = tokenIndex < path.length && path[tokenIndex].row === i && path[tokenIndex].col === j;
                board.push(
                    <div key={`${i}-${j}`} className={cellClass}>
                        {isTokenPosition && (
                            <div className="token-cone">
                                <div className="cone"></div>
                                <div className="base"></div>
                            </div>
                        )}
                    </div>
                );
            }
        }
        return board;
    };

    return (
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
            <div className="grid grid-cols-15 grid-rows-15 gap-0">
                {renderBoard()}
            </div>
        </div>
    );
};

export default LudoBoard;
