import React, { useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { useNavigation } from '@react-navigation/native'

const PostCard = ({ post, onPostDeleted }) => {
  const { user } = useContext(AuthContext)
  const navigation = useNavigation()
  const isAuthor = user && post.userId && user._id === post.userId._id

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/posts/${post._id}`)
              if (onPostDeleted) onPostDeleted(post._id)
            } catch (error) {
              console.error('Failed to delete post', error)
              Alert.alert('Error', 'Failed to delete post.')
            }
          },
        },
      ]
    )
  }

  const handleEdit = () => {
    navigation.navigate('EditPost', { post })
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.meta}>
        Posted by: {post.userId?.username || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.tags}>
        {post.tags?.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>
      {isAuthor && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleEdit} style={styles.button}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  content: {
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
  },
  buttonText: {
    color: '#FFFFFF',
  },
})

export default PostCard