import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen'
import EditPostScreen from '../screens/EditPostScreen'

const Stack = createNativeStackNavigator()

/**
 * A stack navigator for the user profile feature.
 * It includes screens for the main profile page and for editing posts.
 * @returns {JSX.Element} The profile stack navigator.
 */
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Edit Post' }} />
    </Stack.Navigator>
  )
}

export default ProfileStack