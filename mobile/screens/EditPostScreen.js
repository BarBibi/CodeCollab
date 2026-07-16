import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Alert } from 'react-native'
import api from '../services/api'
import Button from '../components/Button'

const EditPostScreen = ({ route, navigation }) => {
  const { post } = route.params
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [tags, setTags] = useState(post.tags.join(', '))
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setError(null)
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag)

    try {
      await api.put(`/posts/${post._id}`, { title, content, tags: tagsArray })
      navigation.goBack()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post')
      Alert.alert('Error', 'Failed to update post.')
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
      <Button title="Save Changes" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

export default EditPostScreen