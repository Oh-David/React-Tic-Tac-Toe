import { SafeAreaView } from 'react-native'
import React, { ReactElement } from 'react'
import styles from "./single-player-game.styles";
import { GradientBackground, Board } from '@components';
import { printFormattedBoard, BoardState } from '@utils'

export default function Game(): ReactElement {
  const b: BoardState = 
    [
      "x", "x", "x",
      "x", "x", "x",
      "x", "x", "x"
    ];
  printFormattedBoard(b);
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