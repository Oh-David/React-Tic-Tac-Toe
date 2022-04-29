import { ScrollView, TextInput as NativeTextInput } from 'react-native';
import React, { ReactElement, useRef } from 'react';
import { GradientBackground, TextInput } from '@components';
import styles from './login.styles';

export default function login(): ReactElement {
  const passwordref = useRef<NativeTextInput | null>(null);
  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput 
          returnKeyType="next" 
          placeholder='Username' 
          style={{ marginBottom: 20 }}
          onSubmitEditing={() => {
            passwordref.current?.focus();
          }}
        />
        <TextInput 
          ref={passwordref}
          returnKeyType="done"
          secureTextEntry 
          placeholder='Password'
        />
      </ScrollView>
    </GradientBackground>
  )
}