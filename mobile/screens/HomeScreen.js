import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import Button from '../components/Button'

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user.email}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}

export default HomeScreen