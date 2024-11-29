import { forwardRef, memo, useContext, useEffect, useImperativeHandle, useState } from "react";
import redPlayerContext from "../context/RedPlayerContext";
import diceContext from "../context/DiceContext";
import greenPlayerContext from "../context/GreenPlayerContext";
import gameInfoContext from "../context/GameInfoContext";
import { initialTokensPositions, greenInitialTokenPositions, primaryPath, primaryPathGreen, secondaryPath, secondaryPathGreen } from "../utils/Paths";

const BoardComponent = () =>{
    const { diceValue, movement, setMovement } = useContext(diceContext);
    const { redPlayerTokensPosi, setRedPlayerTokensPosi } = useContext(redPlayerContext);
    const { greenPlayerTokensPosi, setGreenPlayerTokensPosi } = useContext(greenPlayerContext);
    const { numberOfPlayer, setNumberOfPlayers, playerTurn, setPlayerTurn } = useContext(gameInfoContext);

    const animateTokenMovement = (index, steps) => {
        const tokenPosition = redPlayerTokensPosi[index];
        const onSecondaryPath = tokenPosition[3] || false;
        const currentPositionIndex = tokenPosition[2] || 0;
        const totalRemainingSteps = onSecondaryPath
            ? (secondaryPath.length - currentPositionIndex - 1)
            : (primaryPath.length + secondaryPath.length - currentPositionIndex - 1);
        if (steps > totalRemainingSteps) {
            console.log("Exceeds path limit. No movement.");
            return;
        }
        let step = 0;
        const moveStepByStep = () => {
            setRedPlayerTokensPosi(prevPositions => {
                const updatedPositions = [...prevPositions];
                const token = updatedPositions[index];
                const onSecondaryPath = token[3] || false;
                const currentPath = onSecondaryPath ? secondaryPath : primaryPath;
                const pathLength = currentPath.length;
                const currentPositionIndex = token[2] || 0;
                const nextPositionIndex = currentPositionIndex + 1;

                if (nextPositionIndex < pathLength) {
                    updatedPositions[index] = [
                        currentPath[nextPositionIndex].row,
                        currentPath[nextPositionIndex].col,
                        nextPositionIndex,
                        onSecondaryPath
                    ];
                } else if (!onSecondaryPath) {
                    updatedPositions[index] = [
                        secondaryPath[0].row,
                        secondaryPath[0].col,
                        0,
                        true
                    ];
                }
                return updatedPositions;
            });

            step++;
            if (step < steps) {
                setTimeout(moveStepByStep, 300);
            } else {
                setMovement(false);
                if (steps != 6)
                    setPlayerTurn((playerTurn + 1) % numberOfPlayer);
            }
        };
        moveStepByStep();
    };

    const animateTokenMovementGreen = (index, steps) => {
        const tokenPosition = greenPlayerTokensPosi[index];
        const onSecondaryPath = tokenPosition[3] || false;
        const currentPositionIndex = tokenPosition[2] || 0;
        const totalRemainingSteps = onSecondaryPath
            ? (secondaryPathGreen.length - currentPositionIndex - 1)
            : (primaryPathGreen.length + secondaryPathGreen.length - currentPositionIndex - 1);
        if (steps > totalRemainingSteps) {
            console.log("Exceeds path limit. No movement.");
            return;
        }
        let step = 0;
        const moveStepByStep = () => {
            setGreenPlayerTokensPosi(prevPositions => {
                const updatedPositions = [...prevPositions];
                const token = updatedPositions[index];
                const onSecondaryPath = token[3] || false;
                const currentPath = onSecondaryPath ? secondaryPathGreen : primaryPathGreen;
                const pathLength = currentPath.length;
                const currentPositionIndex = token[2] || 0;
                const nextPositionIndex = currentPositionIndex + 1;

                if (nextPositionIndex < pathLength) {
                    updatedPositions[index] = [
                        currentPath[nextPositionIndex].row,
                        currentPath[nextPositionIndex].col,
                        nextPositionIndex,
                        onSecondaryPath
                    ];
                } else if (!onSecondaryPath) {
                    updatedPositions[index] = [
                        secondaryPathGreen[0].row,
                        secondaryPathGreen[0].col,
                        0,
                        true
                    ];
                }
                return updatedPositions;
            });

            step++;
            if (step < steps) {
                setTimeout(moveStepByStep, 300);
            } else {
                setMovement(false);
                if (steps != 6)
                    setPlayerTurn((playerTurn + 1) % numberOfPlayer);
            }
        };
        moveStepByStep();
    }

    const cellEventListener = (i, j) => {
        if (movement) {
            if (playerTurn == 0) {
                if (diceValue === 6) {
                    const posiArray = [i, j];
                    const index = redPlayerTokensPosi.findIndex(subArray => {
                        return subArray[0] === posiArray[0] && subArray[1] === posiArray[1];
                    });
                    const posiExists = index !== -1;
                    if (posiExists) {
                        const posiExistsInInitial = initialTokensPositions.some(subArray =>
                            subArray.length === posiArray.length && subArray.every((value, idx) => value === posiArray[idx])
                        );

                        if (posiExistsInInitial) {
                            setRedPlayerTokensPosi(prevPositions => {
                                const updatedPositions = [...prevPositions];
                                updatedPositions[index] = [8, 0];
                                setMovement(false);
                                return updatedPositions;
                            });
                        }
                        else {
                            const tokenIndex = redPlayerTokensPosi.findIndex(pos =>
                                pos[0] === i && pos[1] === j
                            );
                            if (tokenIndex !== -1) {
                                const steps = diceValue;
                                animateTokenMovement(tokenIndex, steps);
                            }
                        }
                    }
                } else {
                    const posiArray = [i, j];
                    const posiExistsInInitial = initialTokensPositions.some(subArray =>
                        subArray.length === posiArray.length && subArray.every((value, idx) => value === posiArray[idx])
                    );
                    if (!posiExistsInInitial) {
                        const tokenIndex = redPlayerTokensPosi.findIndex(pos =>
                            pos[0] === i && pos[1] === j
                        );
                        if (tokenIndex !== -1) {
                            const steps = diceValue;
                            animateTokenMovement(tokenIndex, steps);
                        }
                    }
                }
            }
            else if (playerTurn == 1) {
                if (diceValue === 6) {
                    const posiArray = [i, j];
                    const index = greenPlayerTokensPosi.findIndex(subArray => {
                        return subArray[0] === posiArray[0] && subArray[1] === posiArray[1];
                    });
                    const posiExists = index !== -1;
                    if (posiExists) {
                        const posiExistsInInitial = greenInitialTokenPositions.some(subArray =>
                            subArray.length === posiArray.length && subArray.every((value, idx) => value === posiArray[idx])
                        );

                        if (posiExistsInInitial) {
                            setGreenPlayerTokensPosi(prevPositions => {
                                const updatedPositions = [...prevPositions];
                                updatedPositions[index] = [0, 6];
                                setMovement(false);
                                return updatedPositions;
                            });
                        }
                        else {
                            const tokenIndex = greenPlayerTokensPosi.findIndex(pos =>
                                pos[0] === i && pos[1] === j
                            );
                            if (tokenIndex !== -1) {
                                const steps = diceValue;
                                animateTokenMovementGreen(tokenIndex, steps);
                            }
                        }
                    }
                } else {
                    const posiArray = [i, j];
                    const posiExistsInInitial = greenInitialTokenPositions.some(subArray =>
                        subArray.length === posiArray.length && subArray.every((value, idx) => value === posiArray[idx])
                    );
                    if (!posiExistsInInitial) {
                        const tokenIndex = greenPlayerTokensPosi.findIndex(pos =>
                            pos[0] === i && pos[1] === j
                        );
                        if (tokenIndex !== -1) {
                            const steps = diceValue;
                            animateTokenMovementGreen(tokenIndex, steps);
                        }
                    }
                }
            }
        }
    };


    const size = 15;
    const renderBoard = () => {
        let board = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cellClass = 'h-8 w-8 flex items-center justify-center';
                if (i < 6 && j < 6) cellClass += ' bg-green-500';
                else if (i < 6 && j >= 9) cellClass += ' bg-yellow-400';
                else if (i >= 9 && j < 6) cellClass += ' bg-red-500';
                else if (i >= 9 && j >= 9) cellClass += ' bg-blue-500';
                else if (i >= 6 && i <= 8 && j >= 6 && j <= 8) {
                    cellClass += ' bg-black';
                } else {
                    cellClass += ' bg-gray-300 border';
                }
                const posiExists = redPlayerTokensPosi.some(
                    pos => pos[0] === i && pos[1] === j
                );

                const posiExistsGreen = greenPlayerTokensPosi.some(
                    pos => pos[0] === i && pos[1] === j
                );

                if (posiExists) {
                    board.push(
                        <div key={`${i}-${j}`} className={cellClass} onClick={() => cellEventListener(i, j)}>
                            <div className="token-cone">
                                <div className="cone"></div>
                                <div className="base"></div>
                            </div>
                        </div>
                    );
                }
                else if (posiExistsGreen) {
                    board.push(
                        <div key={`${i}-${j}`} className={cellClass} onClick={() => cellEventListener(i, j)}>
                            <div className="token-cone-green">
                                <div className="cone-green"></div>
                                <div className="base-green"></div>
                            </div>
                        </div>
                    );
                }
                else {
                    board.push(
                        <div key={`${i}-${j}`} className={cellClass} onClick={() => cellEventListener(i, j)}></div>
                    );
                }
            }
        }
        return board;
    };
    return (
        <>
            <div className="grid grid-cols-15 grid-rows-15 gap-0">
                {renderBoard()}
            </div>
        </>
    );
}

export default memo(BoardComponent);
