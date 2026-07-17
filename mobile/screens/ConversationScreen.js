import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { io } from 'socket.io-client'
import { useHeaderHeight } from '@react-navigation/elements'

let socket

/**
 * A screen that displays a conversation between two users.
 * It shows the message history and allows the user to send new messages in real-time using Socket.IO.
 * @param {object} props - The properties for the component.
 * @param {object} props.route - The route object provided by React Navigation, containing the receiver's information.
 * @returns {JSX.Element} The conversation screen component.
 */
const ConversationScreen = ({ route }) => {
  const { receiver } = route.params
  const { user } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const flatListRef = useRef()
  const headerHeight = useHeaderHeight()

  useEffect(() => {
    if (!user) return

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${receiver._id}`)
        setMessages(data)
      } catch (err) {
        console.error('Failed to fetch messages', err)
      }
    }
    fetchMessages()

    socket = io(process.env.EXPO_PUBLIC_SOCKET_URL)
    const room = [user._id, receiver._id].sort().join('_')
    socket.emit('join_chat', room)

    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage])
    })

    return () => {
      if (socket) socket.disconnect()
    }
  }, [user, receiver])

  const sendMessage = () => {
    if (!content.trim()) return
    const room = [user._id, receiver._id].sort().join('_')
    const messageData = {
      senderId: user._id,
      receiverId: receiver._id,
      content,
      room,
    }
    socket.emit('send_message', messageData)
    setContent('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.senderId === user._id ? styles.myMessage : styles.otherMessage]}>
              <Text style={item.senderId === user._id ? styles.myMessageText : styles.otherMessageText}>
                {item.content}
              </Text>
            </View>
          )}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            placeholder="Type a message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messageBubble: { padding: 10, borderRadius: 20, marginVertical: 5, maxWidth: '80%' },
  myMessage: { backgroundColor: '#007BFF', alignSelf: 'flex-end', marginRight: 10 },
  otherMessage: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start', marginLeft: 10 },
  myMessageText: { color: 'white' },
  otherMessageText: { color: 'black' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: 'white' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15 },
  sendButton: { marginLeft: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#007BFF', paddingHorizontal: 20, borderRadius: 20 },
  sendButtonText: { color: 'white' },
})

export default ConversationScreen