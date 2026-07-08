'use client'

import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import styles from './PostCard.module.css'
import PostEditor from './PostEditor'

export default function PostCard({ post, onPostDeleted, onPostUpdated }) {
    const { user } = useContext(AuthContext)
    const [likes, setLikes] = useState(post.likes || [])
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    
    const isLiked = user && likes.includes(user._id)
    const isAuthor = user && post.userId && user._id === post.userId._id

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

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${post._id}`)
                if (onPostDeleted) onPostDeleted(post._id)
            } catch (error) {
                console.error('Failed to delete post', error)
            }
        }
    }

    const handleUpdate = (updatedPost) => {
        setIsEditing(false)
        if (onPostUpdated) onPostUpdated(updatedPost)
    }

    if (isEditing) {
        return <PostEditor post={post} onPostUpdated={handleUpdate} onCancel={() => setIsEditing(false)} />
    }

    return (
        <div className={styles.card}>
            <h4 className={styles.title}>{post.title}</h4>
            <p className={styles.meta}>
                Posted by: {post.userId?.username || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <pre className={styles.codeBlock}>
                <code>{post.content}</code>
            </pre>
            <div className={styles.tags}>
                {post.tags?.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                        #{tag}
                    </span>
                ))}
            </div>
            <div className={styles.actions}>
                <button 
                    onClick={handleLike} 
                    className={isLiked ? styles.likeButton : ''}
                >
                    {isLiked ? 'Unlike' : 'Like'} ({likes.length})
                </button>
                <button onClick={toggleComments}>
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>
                {isAuthor && (
                    <>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </>
                )}
            </div>

            {showComments && (
                <div className={styles.commentsSection}>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.map(c => (
                                <li key={c._id} className={styles.comment}>
                                    <strong>{c.userId?.username || 'Unknown'}:</strong> {c.content}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noComments}>No comments yet.</p>
                    )}
                    
                    <form onSubmit={handleAddComment} className={styles.commentForm}>
                        <input 
                            type="text" 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder="Write a comment..." 
                            className={styles.commentInput}
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
            )}
        </div>
    )
}