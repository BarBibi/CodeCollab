import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChatScreen from '../screens/ChatScreen'
import ConversationScreen from '../screens/ConversationScreen'

const Stack = createNativeStackNavigator()

/**
 * A stack navigator for the chat feature.
 * It includes screens for the list of chats and individual conversations.
 * @returns {JSX.Element} The chat stack navigator.
 */
const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatScreen} options={{ title: 'Chats' }} />
      <Stack.Screen name="Conversation" component={ConversationScreen} options={({ route }) => ({ title: route.params.receiver.username })} />
    </Stack.Navigator>
  )
}

export default ChatStack