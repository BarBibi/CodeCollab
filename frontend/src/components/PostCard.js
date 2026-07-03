'use client'

export default function PostCard({ post }) {
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
                <button style={{ marginRight: '10px' }}>Like ({post.likes?.length || 0})</button>
                <button>Comment</button>
            </div>
        </div>
    )
}