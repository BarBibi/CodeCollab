import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChatScreen from '../screens/ChatScreen'
import ConversationScreen from '../screens/ConversationScreen'

const Stack = createNativeStackNavigator()

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatScreen} options={{ title: 'Chats' }} />
      <Stack.Screen name="Conversation" component={ConversationScreen} options={({ route }) => ({ title: route.params.receiver.username })} />
    </Stack.Navigator>
  )
}

export default ChatStack