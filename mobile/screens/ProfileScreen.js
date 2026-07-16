import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput, RefreshControl } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import PostCard from '../components/PostCard'
import PostCreator from '../components/PostCreator'
import { useFocusEffect } from '@react-navigation/native'

const ProfileScreen = () => {
  const { user } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [fetchError, setFetchError] = useState(null)
  const [dateFilter, setDateFilter] = useState('')
  const [usernameFilter, setUsernameFilter] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchPosts = async () => {
    try {
      const params = {}
      if (dateFilter) params.date = dateFilter
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
              <TextInput
                style={styles.filterInput}
                placeholder="YYYY-MM-DD"
                value={dateFilter}
                onChangeText={setDateFilter}
              />
            </View>
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