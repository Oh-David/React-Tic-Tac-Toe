import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import styles from "./button.styles";
import React, { ReactElement } from 'react';
import { Text } from "@components";

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export default function button({ title, style, ...props }: ButtonProps): ReactElement {
  return (
    <TouchableOpacity {...props} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}