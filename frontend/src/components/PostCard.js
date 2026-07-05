'use client'

import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

export default function PostCard({ post }) {
    const { user } = useContext(AuthContext)
    const [likes, setLikes] = useState(post.likes || [])
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState('')
    
    const isLiked = user && likes.includes(user._id)

    const handleLike = async () => {
        try {
            const { data } = await api.put(`/posts/${post._id}/like`)
            setLikes(data.likes)
        } catch (error) {
            console.error('Failed to toggle like', error)
        }
    }

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/posts/${post._id}/comments`)
            setComments(data)
        } catch (error) {
            console.error('Failed to fetch comments', error)
        }
    }

    const toggleComments = () => {
        if (!showComments) {
            fetchComments()
        }
        setShowComments(!showComments)
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            const { data } = await api.post(`/posts/${post._id}/comments`, { content: newComment })
            setComments([...comments, data])
            setNewComment('')
        } catch (error) {
            console.error('Failed to add comment', error)
        }
    }

    return (
        <div style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>{post.title}</h4>
            <p style={{ fontSize: '0.9em', color: 'gray', margin: '0 0 10px 0' }}>
                Posted by: {post.userId?.username || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', overflowX: 'auto' }}>
                <code>{post.content}</code>
            </pre>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                {post.tags?.map((tag, index) => (
                    <span key={index} style={{ backgroundColor: '#e0e0e0', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8em' }}>
                        #{tag}
                    </span>
                ))}
            </div>
            <div style={{ marginTop: '15px' }}>
                <button 
                    onClick={handleLike} 
                    style={{ marginRight: '10px', color: isLiked ? 'blue' : 'black', cursor: 'pointer' }}
                >
                    {isLiked ? 'Unlike' : 'Like'} ({likes.length})
                </button>
                <button onClick={toggleComments} style={{ cursor: 'pointer' }}>
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>
            </div>

            {showComments && (
                <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    {comments.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {comments.map(c => (
                                <li key={c._id} style={{ marginBottom: '10px', fontSize: '0.9em' }}>
                                    <strong>{c.userId?.username || 'Unknown'}:</strong> {c.content}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ fontSize: '0.9em', color: 'gray' }}>No comments yet.</p>
                    )}
                    
                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <input 
                            type="text" 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder="Write a comment..." 
                            style={{ flex: 1, padding: '5px' }}
                        />
                        <button type="submit" style={{ cursor: 'pointer' }}>Post</button>
                    </form>
                </div>
            )}
        </div>
    )
}