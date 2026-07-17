import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, ActivityIndicator } from 'react-native'
import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen'
import TabNavigator from './TabNavigator'
import { AuthContext } from '../context/AuthContext'

const Stack = createNativeStackNavigator()

/**
 * The main navigator for the application.
 * It handles the navigation flow based on the user's authentication status.
 * If the user is authenticated, it displays the main app content using a tab navigator.
 * Otherwise, it displays the sign-in and sign-up screens.
 * @returns {JSX.Element} The main navigation component.
 */
const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
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