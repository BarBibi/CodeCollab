import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

const ChatScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [conversations, setConversations] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/messages/conversations')
        setConversations(data)
      } catch (err) {
        console.error('Failed to fetch conversations', err)
        setError('Failed to load conversations.')
      }
    }
    fetchConversations()
  }, [user])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    try {
      const { data } = await api.get(`/users?search=${searchQuery}`)
      setSearchResults(data)
    } catch (err) {
      console.error('Failed to search users', err)
      setError('Search failed.')
    }
  }

  const startChat = (selectedUser) => {
    navigation.navigate('Conversation', { receiver: selectedUser })
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a user..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem} onPress={() => startChat(item)}>
              <Text>{item.username}</Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={<Text style={styles.listHeader}>Search Results</Text>}
        />
      )}

      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => startChat(item)}>
            <Text>{item.username}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={<Text style={styles.listHeader}>Recent Chats</Text>}
        ListEmptyComponent={<Text>No recent conversations.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchContainer: { flexDirection: 'row', marginBottom: 10 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  button: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginLeft: 10, justifyContent: 'center' },
  buttonText: { color: '#fff' },
  listHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  listItem: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  lastMessage: { color: 'gray', marginTop: 5 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
})

export default ChatScreen