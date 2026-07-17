import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Text } from 'react-native'
import api from '../services/api'
import Button from './Button'

/**
 * A component that provides a form for creating new posts.
 * It includes fields for a title, content, and tags.
 * @param {object} props - The properties for the component.
 * @param {(newPost: object) => void} props.onPostCreated - A callback function to be called when a new post is successfully created.
 * @returns {JSX.Element} A form for creating a new post.
 */
const PostCreator = ({ onPostCreated }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setError(null)
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)

    try {
      const { data } = await api.post('/posts', { title, content, tags: tagsArray })
      setTitle('')
      setContent('')
      setTags('')
      if (onPostCreated) onPostCreated(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Code snippet or problem..."
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        value={tags}
        onChangeText={setTags}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Create Post" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
})

export default PostCreator