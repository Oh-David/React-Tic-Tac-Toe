import { SafeAreaView } from 'react-native'
import React, { ReactElement } from 'react'
import styles from "./single-player-game.styles";
import { GradientBackground, Board } from '@components';
import { printFormattedBoard, BoardState, isEmpty, isFull, getAvailableMoves, isTerminal } from '@utils'

export default function Game(): ReactElement {
  const b: BoardState = 
    [
      null, "x", null,
      null, "x", null,
      null, "x", null
    ];
  printFormattedBoard(b);
  console.log(isTerminal(b));
  // console.log(isEmpty(b));
  // console.log(isFull(b));
  // console.log(getAvailableMoves(b));
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
          <Board 
            onCellPressed={(index) => {
              alert(index)
            }}
            state={b}
            size={300}
            ></Board>
      </SafeAreaView>
    </GradientBackground>
  )
}