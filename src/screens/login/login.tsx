import { 
  ScrollView, 
  TextInput as NativeTextInput, 
  Alert, 
  TouchableOpacity } from 'react-native';
import React, { ReactElement, useRef, useState } from 'react';
import { GradientBackground, TextInput, Button, Text } from '@components';
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { Auth } from "aws-amplify";
import styles from './login.styles';

type LoginProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Login">;
}

export default function login({navigation}: LoginProps): ReactElement {
  const passwordref = useRef<NativeTextInput | null>(null);
  const [form, setForm] = useState({
    username: "test",
    password: "12345678"
  });

  const [loading, setLoading] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string) => {
    setForm({...form, [key]: value});
  }

  const login = async () => {
    setLoading(true);
    const {username, password} = form;
    try {
      await Auth.signIn(username, password);
      navigation.navigate("Home");
    } catch(error) {
      if (error === "UserNotConfirmedException")
      {
         navigation.navigate("SignUp", {username});
      } else {
        Alert.alert("Error!", "Login Error");
      }
    }
    setLoading(false);
  }

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput 
          value={form.username}
          onChangeText={value => {
            setFormInput("username", value)
          }}
          returnKeyType="next" 
          placeholder='Username' 
          style={{ marginBottom: 20 }}
          onSubmitEditing={() => {
            passwordref.current?.focus();
          }}
        />
        <TextInput 
          value={form.password}
          onChangeText={value => {
            setFormInput("password", value)
          }}
          ref={passwordref}
          returnKeyType="done"
          style={{ marginBottom: 30 }}
          secureTextEntry 
          placeholder='Password'
        />
        <TouchableOpacity
          onPress={() =>
          {
            navigation.navigate("ForgotPassword");
          }}>
          <Text style={styles.forgotPasswordLink}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Button loading={loading} title="Login" onPress={login} />

        <TouchableOpacity
          onPress={() =>
          {
            navigation.navigate("SignUp");
          }}>
          <Text style={styles.registerLink}>
            Don't have an account?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </GradientBackground>
  )
}