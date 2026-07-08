'use client'

import { useState } from 'react'
import api from '../services/api'
import styles from './PostCreator.module.css' // Reusing styles for consistency

/**
 * PostEditor Component
 * 
 * This component provides a form for users to edit their existing posts.
 * It's pre-filled with the post's current data and submits the updated information to the API.
 * 
 * @param {object} props - The properties for the component.
 * @param {object} props.post - The post object to be edited.
 * @param {(updatedPost: object) => void} props.onPostUpdated - A callback function to be called when the post is updated.
 * @param {() => void} props.onCancel - A callback function to be called when the user cancels the edit.
 * @returns {JSX.Element} A form for editing an existing post.
 */
export default function PostEditor({ post, onPostUpdated, onCancel }) {
    const [title, setTitle] = useState(post.title)
    const [content, setContent] = useState(post.content)
    const [tags, setTags] = useState(post.tags.join(', '))
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

        try {
            const { data } = await api.put(`/posts/${post._id}`, {
                title,
                content,
                tags: tagsArray
            })
            
            if (onPostUpdated) onPostUpdated(data)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post')
        }
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Edit Post</h3>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required
                />
                <textarea 
                    placeholder="Code snippet or problem description..." 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    rows="5"
                    required
                />
                <input 
                    type="text" 
                    placeholder="Tags (comma separated, e.g., React, Node.js)" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}