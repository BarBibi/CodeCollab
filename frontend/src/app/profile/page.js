'use client'

import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import api from '../../services/api'
import PostCreator from '../../components/PostCreator'
import PostCard from '../../components/PostCard'
import styles from './profile.module.css'

export default function ProfilePage() {
    const { user, loading } = useContext(AuthContext)
    const router = useRouter()
    const [posts, setPosts] = useState([])
    const [fetchError, setFetchError] = useState(null)
    const [dateFilter, setDateFilter] = useState('')
    const [usernameFilter, setUsernameFilter] = useState('')

    const fetchPosts = async (date, username) => {
        try {
            const params = {}
            if (date) params.date = date
            if (username) params.username = username
            const { data } = await api.get('/posts', { params })
            setPosts(data)
        } catch (err) {
            setFetchError('Failed to load posts.')
            console.error(err)
        }
    }

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin')
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user) {
            fetchPosts(dateFilter, usernameFilter)
        }
    }, [user, dateFilter, usernameFilter])

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts])
    }

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(p => p._id !== postId))
    }

    const handlePostUpdated = (updatedPost) => {
        setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p))
    }

    if (loading || !user) return <p>Loading...</p>

    return (
        <main className={styles.container}>
            <h2 className={styles.welcomeMessage}>Welcome, {user.username}</h2>
            
            <PostCreator onPostCreated={handlePostCreated} />

            <section className={styles.postsSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 className={styles.sectionTitle}>Recent Posts</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                            type="text" 
                            placeholder="Search by username..."
                            value={usernameFilter} 
                            onChange={(e) => setUsernameFilter(e.target.value)} 
                        />
                        <input 
                            type="date" 
                            value={dateFilter} 
                            onChange={(e) => setDateFilter(e.target.value)} 
                        />
                    </div>
                </div>
                {fetchError && <p className={styles.error}>{fetchError}</p>}
                
                {posts.length === 0 && !fetchError ? (
                    <p className={styles.noPosts}>No posts available for the selected filters.</p>
                ) : (
                    posts.map(post => (
                        <PostCard 
                            key={post._id} 
                            post={post} 
                            onPostDeleted={handlePostDeleted}
                            onPostUpdated={handlePostUpdated}
                        />
                    ))
                )}
            </section>
        </main>
    )
}