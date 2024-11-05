import { memo, useContext, useState } from "react";
import redPlayerContext from "../context/RedPlayerContext";
import diceContext from "../context/DiceContext";

const BoardComponent = () => {
    const { diceValue, movement, setMovement } = useContext(diceContext);
    const { redPlayerTokensPosi, setRedPlayerTokensPosi } = useContext(redPlayerContext);
    const initialTokensPositions = [
        [11, 2],
        [11, 3],
        [12, 2],
        [12, 3]
    ];

    const [onSecondaryPath, setOnSecondaryPath] = useState(false);

    const primaryPath = [
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
    const secondaryPath = [
        { row: 8, col: 0 }, { row: 7, col: 0 }, { row: 7, col: 1 }, { row: 7, col: 2 }, { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 }
    ];

    const animateTokenMovement = (index, steps) => {
        let step = 0;
        const moveStepByStep = () => {
            setRedPlayerTokensPosi(prevPositions => {
                const updatedPositions = [...prevPositions];
                const token = updatedPositions[index];
                const onSecondaryPath = token[3] || false;
                const currentPath = onSecondaryPath ? secondaryPath : primaryPath;
                const pathLength = currentPath.length;
                const nextPositionIndex = (token[2] || 0) + 1;
                if (onSecondaryPath) {
                    const remainingSteps = secondaryPath.length - (token[2] || 0) - 1;
                    if (steps > remainingSteps) {
                        return prevPositions;
                    }
                }

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
            }
        };
        moveStepByStep();
    };
    

    const cellEventListener = (i, j) => {
        if (movement) {
            if (diceValue === 6) {
                const posiArray = [i, j];
                const index = redPlayerTokensPosi.findIndex(subArray => {
                    return subArray[0] === posiArray[0] && subArray[1] === posiArray[1];
                });
                const posiExists = index !== -1;
                console.log(posiExists, index, posiArray, redPlayerTokensPosi)
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
                const posiArray=[i,j];
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
                const posiExists = redPlayerTokensPosi.some(
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
                } else {
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
