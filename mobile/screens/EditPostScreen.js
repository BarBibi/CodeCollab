import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Alert, Text } from 'react-native'
import api from '../services/api'
import Button from '../components/Button'

/**
 * A screen that allows users to edit their own posts.
 * It displays a form pre-filled with the post's current data and allows the user to save their changes.
 * @param {object} props - The properties for the component.
 * @param {object} props.route - The route object provided by React Navigation, containing the post to be edited.
 * @param {object} props.navigation - The navigation object provided by React Navigation.
 * @returns {JSX.Element} The edit post screen component.
 */
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