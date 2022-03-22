import { StatusBar } from "expo-status-bar";
import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import {Game, Home} from "@screens";
import AppLoading from 'expo-app-loading';
import { AppBootstrap, Text } from "@components";

export default function App(): ReactElement {
  return (
    <AppBootstrap>
      <View style={styles.container}>
        <Text
          onPress={() => {
            alert(true);
          }}
          style={{
            fontSize: 25,
          }}
          >
            x <Text weight="400"> x </Text>
          </Text>
      </View>
    </AppBootstrap>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
