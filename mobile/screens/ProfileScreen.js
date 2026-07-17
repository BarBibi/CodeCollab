import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput, RefreshControl, TouchableOpacity, Platform } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import PostCard from '../components/PostCard'
import PostCreator from '../components/PostCreator'
import { useFocusEffect } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'

/**
 * The user's profile screen.
 * It displays a welcome message, a form to create new posts, and a list of recent posts.
 * It also provides functionality to filter posts by username and date.
 * @returns {JSX.Element} The profile screen component.
 */
const ProfileScreen = () => {
  const { user } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [fetchError, setFetchError] = useState(null)
  const [dateFilter, setDateFilter] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [usernameFilter, setUsernameFilter] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchPosts = async () => {
    try {
      const params = {}
      if (dateFilter) {
        const year = dateFilter.getFullYear()
        const month = ('0' + (dateFilter.getMonth() + 1)).slice(-2)
        const day = ('0' + dateFilter.getDate()).slice(-2)
        params.date = `${year}-${month}-${day}`
      }
      if (usernameFilter) params.username = usernameFilter
      const { data } = await api.get('/posts', { params })
      setPosts(data)
    } catch (err) {
      setFetchError('Failed to load posts.')
      console.error(err)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchPosts()
      }
    }, [user, dateFilter, usernameFilter])
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchPosts().then(() => setRefreshing(false))
  }, [dateFilter, usernameFilter])

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts])
  }

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId))
  }

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateFilter
    setShowDatePicker(Platform.OS === 'ios')
    setDateFilter(currentDate)
  }

  if (!user) return <Text>Loading...</Text>

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} onPostDeleted={handlePostDeleted} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            <Text style={styles.welcomeMessage}>Welcome, {user.username}</Text>
            <PostCreator onPostCreated={handlePostCreated} />
            <View style={styles.filters}>
              <TextInput
                style={styles.filterInput}
                placeholder="Search by username..."
                value={usernameFilter}
                onChangeText={setUsernameFilter}
              />
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{dateFilter ? dateFilter.toLocaleDateString() : 'Select Date'}</Text>
              </TouchableOpacity>
            </View>
            {dateFilter && (
              <TouchableOpacity onPress={() => setDateFilter(null)} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear Date</Text>
              </TouchableOpacity>
            )}
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateFilter || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            {fetchError && <Text style={styles.error}>{fetchError}</Text>}
            <Text style={styles.listHeader}>Recent Posts</Text>
          </>
        }
        ListEmptyComponent={<Text>No posts found.</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    width: '48%',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#333',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#007BFF',
  },
  error: {
    color: 'red',
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
})

export default ProfileScreen