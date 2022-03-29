import { View, ScrollView, Image } from 'react-native'
import React from 'react'
import styles from "./home.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { GradientBackground, Button } from '@components'

type HomeProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Home">
}

export default function Home({navigation}: HomeProps) {
  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          style={styles.logo} 
          source={require("@assets/logo.png")} 
        />
        <View style={styles.buttons}>
          <Button 
            style={styles.button}
            onPress={() => {
              navigation.navigate
              ("SinglePlayerGame");
            }} 
            title="Single Player" 
          />
          <Button 
            style={styles.button}
            onPress={() => {}} 
            title="MultiPlayer" 
          />
          <Button 
            style={styles.button}
            onPress={() => {}} 
            title="Login" 
          />
          <Button 
            style={styles.button}
            onPress={() => {}}
            title="Settings"
          />
        </View>
      </ScrollView>
    </GradientBackground>
  )
}