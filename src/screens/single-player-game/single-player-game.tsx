import { SafeAreaView } from 'react-native'
import React, { ReactElement, useState } from 'react'
import styles from "./single-player-game.styles";
import { GradientBackground, Board } from '@components';
import { printFormattedBoard, BoardState, isEmpty, isFull, getAvailableMoves, isTerminal } from '@utils'

export default function Game(): ReactElement {
  const [state, setState] = useState<BoardState>(
    [
      null, null, null,
      null, null, null,
      null, null, null
    ]
    );
  const handleOnCellPressed = (cell: number): void => {
    const stateCopy: BoardState = [...state];
    if (stateCopy[cell] || isTerminal(stateCopy)) return;
    
    stateCopy[cell] = "x";
    setState(stateCopy);
  }
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
          <Board 
            disabled={Boolean(isTerminal(state))}
            onCellPressed={(cell) => {
              handleOnCellPressed(cell)
            }}
            state={state}
            size={300}
            ></Board>
      </SafeAreaView>
    </GradientBackground>
  )
}