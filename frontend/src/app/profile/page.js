'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // TODO: Fetch posts from API
    }, []);

    return (
        <main>
            <h2>My Feed & Profile</h2>
            {/* TODO: Add PostCreator component */}
            <section>
                <h3>Recent Posts</h3>
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    <ul>
                        {posts.map(post => (
                            <li key={post._id}>{post.title}</li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}