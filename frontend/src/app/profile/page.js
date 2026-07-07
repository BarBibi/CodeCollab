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

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin')
        }
    }, [user, loading, router])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await api.get('/posts')
                setPosts(data)
            } catch (err) {
                setFetchError('Failed to load posts.')
                console.error(err)
            }
        }

        if (user) {
            fetchPosts()
        }
    }, [user])

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts])
    }

    if (loading || !user) return <p>Loading...</p>

    return (
        <main className={styles.container}>
            <h2 className={styles.welcomeMessage}>Welcome, {user.username}</h2>
            
            <PostCreator onPostCreated={handlePostCreated} />

            <section className={styles.postsSection}>
                <h3 className={styles.sectionTitle}>Recent Posts</h3>
                {fetchError && <p className={styles.error}>{fetchError}</p>}
                
                {posts.length === 0 && !fetchError ? (
                    <p className={styles.noPosts}>No posts available. Be the first to post!</p>
                ) : (
                    posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))
                )}
            </section>
        </main>
    )
}