'use client'

import { useEffect, useState, useContext } from 'react'
import { io } from 'socket.io-client'
import api from '../../services/api'
import { AuthContext } from '../../context/AuthContext'

let socket

export default function ChatPage() {
    const { user } = useContext(AuthContext)
    const [activeChat, setActiveChat] = useState(false)
    const [receiver, setReceiver] = useState(null)
    const [messages, setMessages] = useState([])
    const [content, setContent] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) return

        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

        socket.on('receive_message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage])
        })

        return () => {
            if (socket) socket.disconnect()
        }
    }, [user])

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        try {
            const { data } = await api.get(`/users?search=${searchQuery}`)
            setSearchResults(data)
        } catch (err) {
            console.error('Failed to search users', err)
            setError('Search failed.')
        }
    }

    const startChat = async (selectedUser) => {
        setError(null)
        try {
            const { data } = await api.get(`/messages/${selectedUser._id}`)
            setMessages(data)
            setReceiver(selectedUser)
            setActiveChat(true)

            const room = [user._id, selectedUser._id].sort().join('_')
            socket.emit('join_chat', room)
        } catch (err) {
            setError('Failed to load chat history.')
            console.error(err)
        }
    }

    const sendMessage = (e) => {
        e.preventDefault()
        if (!content.trim() || !activeChat) return

        const room = [user._id, receiver._id].sort().join('_')
        const messageData = {
            senderId: user._id,
            receiverId: receiver._id,
            content,
            room
        }

        socket.emit('send_message', messageData)
        setContent('')
    }

    if (!user) return <p style={{ padding: '2rem' }}>Please sign in to access the chat.</p>

    return (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 15px' }}>
            <h2>Developer Lounge (Private Chat)</h2>
            
            {!activeChat ? (
                <div style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Search by username or email..."
                            style={{ padding: '8px', width: '300px' }}
                        />
                        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
                            Search
                        </button>
                    </form>

                    {searchResults.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc', borderRadius: '5px' }}>
                            {searchResults.map((result) => (
                                <li 
                                    key={result._id} 
                                    style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <span><strong>{result.username}</strong> ({result.email})</span>
                                    <button onClick={() => startChat(result)} style={{ cursor: 'pointer', padding: '5px 10px' }}>
                                        Message
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                </div>
            ) : (
                <div style={{ border: '1px solid #ccc', display: 'flex', flexDirection: 'column', height: '60vh' }}>
                    <div style={{ padding: '10px', backgroundColor: '#f4f4f4', borderBottom: '1px solid #ccc' }}>
                        <strong>Chatting with: {receiver.username}</strong>
                        <button 
                            onClick={() => { setActiveChat(false); setReceiver(null); setMessages([]); }} 
                            style={{ float: 'right', cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </div>
                    
                    <ul style={{ flex: 1, overflowY: 'auto', padding: '15px', listStyle: 'none', margin: 0 }}>
                        {messages.map((msg, idx) => {
                            const isMe = msg.senderId === user._id
                            return (
                                <li key={idx} style={{ textAlign: isMe ? 'right' : 'left', marginBottom: '10px' }}>
                                    <span style={{ 
                                        backgroundColor: isMe ? '#d1e7dd' : '#e2e3e5', 
                                        padding: '8px 12px', 
                                        borderRadius: '15px', 
                                        display: 'inline-block' 
                                    }}>
                                        {msg.content}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>

                    <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
                        <input 
                            type="text" 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Type a message..." 
                            style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </main>
    )
}