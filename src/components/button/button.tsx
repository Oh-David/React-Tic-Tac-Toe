import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import styles from "./button.styles";
import React, { ReactElement } from 'react';
import { Text } from "@components";

type ButtonProps = {
  title: string;
  loading?: boolean;
} & TouchableOpacityProps;

export default function button({ title, style, loading, ...props }: ButtonProps): ReactElement {
  return (
    <TouchableOpacity disabled={loading} {...props} style={[styles.button, style]}>
        {loading ? (<ActivityIndicator color="#000" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}