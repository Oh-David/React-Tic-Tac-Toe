import { View, Text, Button } from 'react-native'
import React from 'react'
import styles from "./home.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";

type HomeProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Home">
}

export default function Home({navigation}: HomeProps) {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button 
        title="Game"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    </View>
  )
}