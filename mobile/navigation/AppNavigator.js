import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen'
import HomeScreen from '../screens/HomeScreen'
import { AuthContext } from '../context/AuthContext'

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
  const { user } = useContext(AuthContext)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator