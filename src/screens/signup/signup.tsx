import { 
  ScrollView, 
  TextInput as NativeTextInput, 
  Alert, 
  View, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator } from 'react-native';
import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { GradientBackground, TextInput, Button, Text } from '@components';
import { StackNavigationProp } from "@react-navigation/stack";
import { useHeaderHeight } from "@react-navigation/elements"
import { RouteProp } from "@react-navigation/native"
import { StackNavigatorParams } from "@config/navigator";
import { Auth } from "aws-amplify";
import OTPInputView from '@twotalltotems/react-native-otp-input';
import styles from './signup.styles';
import { colors } from '@utils';
import { TouchableOpacity } from 'react-native-gesture-handler';

type SignUpProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "SignUp">;
  route: RouteProp<StackNavigatorParams, "SignUp">;
}

export default function SignUp({navigation, route}: SignUpProps): ReactElement {
  const unconfirmedUsername = route.params?.username;
  const headerHeight = useHeaderHeight();
  const passwordref = useRef<NativeTextInput | null>(null);
  const emailRef = useRef<NativeTextInput | null>(null);
  const [form, setForm] = useState({
    username: "test2",
    email: "alexah@oxnipaths.com",
    password: "12345678"
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"signUp" | "otp">(unconfirmedUsername ? "otp" : "signUp");
  const [confirming, setConfirming] = useState(false);
  const [resending, setResending] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string) => {
    setForm({...form, [key]: value});
  }

  const signUp = async () => {
    setLoading(true);
    const {username, password, email} = form;
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email
        }
      });
      setStep("otp");
    } catch(error) {
      Alert.alert("Error!", "Error Signing Up");
    }
    setLoading(false);
  }

  const confirmCode = async (code: string) => {
    setConfirming(true);
    try {
      await Auth.confirmSignUp(form.username || unconfirmedUsername || "", code);
      navigation.navigate("Login");
      Alert.alert("Success!", "You can now login with you account.");
    } catch (error) {
      Alert.alert("Error!", "Error Confirming Code");
    }
    setConfirming(false);
  }

  const resendCode = async (username: string) => {
    setResending(true);
    try {
      await Auth.resendSignUp(username);
    } catch (error) {
      Alert.alert("Error!", "Error resending code");
    }
    setResending(false);
  }

  useEffect(() => {
    if (unconfirmedUsername) {
      resendCode(unconfirmedUsername);
    }
  }, [])
  
  return (
    <GradientBackground>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.container}>
          {step === "otp" && 
            <>
            <Text style={styles.otpText}>Enter the code that you received via email.</Text>
            {confirming ? (<ActivityIndicator color={colors.lightGreen}/> 
            ) : (
              <>
                <OTPInputView 
                  placeholderCharacter=''
                  placeholderTextColor='#5d5379'
                  pinCount={6}
                  codeInputFieldStyle={styles.otpInputBox}
                  codeInputHighlightStyle={styles.otpActiveInputBox}
                  onCodeFilled={code => {
                    // console.log(code);
                    confirmCode(code);
                  }}
                />
                {resending ? (
                  <ActivityIndicator color={colors.lightGreen} />
                ) : (
                  <TouchableOpacity onPress={() => {
                    if(form.username) {
                      resendCode(form.username);
                    }
                    if(unconfirmedUsername) {
                      resendCode(form.username);
                    }
                  }}>
                    <Text style={styles.resendLink} >Resend Code</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            </>
            }
          {step === "signUp" &&
            (
            <>
              <TextInput 
                value={form.username}
                onChangeText={value => {
                  setFormInput("username", value)
                }}
                returnKeyType="next" 
                placeholder='Username' 
                style={{ marginBottom: 20 }}
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />
              <TextInput 
                keyboardType="email-address"
                value={form.email}
                onChangeText={value => {
                  setFormInput("email", value)
                }}
                ref={emailRef}
                returnKeyType="next" 
                placeholder='Email' 
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
              <Button loading={loading} title="Sign-Up" onPress={signUp} />
            </>
            )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  )
}