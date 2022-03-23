import { View, Text } from 'react-native'
import React from 'react'
import styles from "./game.styles";
import { GradientBackground } from '@components';

export default function Game() {
  return (
    <View style={styles.container}>
      <GradientBackground>
        <Text>Game</Text>
      </GradientBackground>
    </View>
  )
}