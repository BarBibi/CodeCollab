'use client'

import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import api from '../../services/api'
import PostCreator from '../../components/PostCreator'
import PostCard from '../../components/PostCard'

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
        // Optimistically update the UI by prepending the new post
        // Real-world scenarios might require a re-fetch to get populated fields (like username)
        setPosts([newPost, ...posts])
    }

    if (loading || !user) return <p>Loading...</p>

    return (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 15px' }}>
            <h2>Welcome, {user.username}</h2>
            
            <PostCreator onPostCreated={handlePostCreated} />

            <section>
                <h3>Recent Posts</h3>
                {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
                
                {posts.length === 0 && !fetchError ? (
                    <p>No posts available. Be the first to post!</p>
                ) : (
                    posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))
                )}
            </section>
        </main>
    )
}