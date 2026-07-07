'use client'

import { useState } from 'react'
import api from '../services/api'
import styles from './PostCreator.module.css'

export default function PostCreator({ onPostCreated }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

        try {
            const { data } = await api.post('/posts', {
                title,
                content,
                tags: tagsArray
            })
            
            setTitle('')
            setContent('')
            setTags('')
            if (onPostCreated) onPostCreated(data)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post')
        }
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Create a New Post</h3>
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
                <button type="submit">Post</button>
            </form>
        </div>
    )
}