import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

/**
 * A reusable button component.
 * @param {object} props - The properties for the component.
 * @param {string} props.title - The text to display on the button.
 * @param {() => void} props.onPress - The function to call when the button is pressed.
 * @returns {JSX.Element} A styled, pressable button.
 */
const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
})

export default Button