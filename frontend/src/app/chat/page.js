'use client'

import { useEffect, useState, useContext } from 'react'
import { io } from 'socket.io-client'
import api from '../../services/api'
import { AuthContext } from '../../context/AuthContext'
import styles from './chat.module.css'

let socket

export default function ChatPage() {
    const { user } = useContext(AuthContext)
    const [activeChat, setActiveChat] = useState(false)
    const [receiver, setReceiver] = useState(null)
    const [messages, setMessages] = useState([])
    const [content, setContent] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [conversations, setConversations] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) return

        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

        socket.on('receive_message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage])
        })

        const fetchConversations = async () => {
            try {
                const { data } = await api.get('/messages/conversations')
                setConversations(data)
            } catch (err) {
                console.error('Failed to fetch conversations', err)
            }
        }
        fetchConversations()

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

    if (!user) return <p className={styles.container}>Please sign in to access the chat.</p>

    return (
        <main className={styles.container}>
            <h2 className={styles.title}>Developer Lounge (Private Chat)</h2>
            
            {!activeChat ? (
                <>
                    <div className={styles.searchContainer}>
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                placeholder="Search by username or email..."
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchButton}>
                                Search
                            </button>
                        </form>

                        {searchResults.length > 0 && (
                            <ul className={styles.searchResults}>
                                {searchResults.map((result) => (
                                    <li 
                                        key={result._id} 
                                        className={styles.searchResultItem}
                                    >
                                        <span><strong>{result.username}</strong> ({result.email})</span>
                                        <button onClick={() => startChat(result)} className={styles.messageButton}>
                                            Message
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {error && <p className={styles.error}>{error}</p>}
                    </div>
                    <div>
                        <h3 className={styles.title}>Your Conversations</h3>
                        {conversations.length > 0 ? (
                            <ul className={styles.searchResults}>
                                {conversations.map((convo) => (
                                    <li 
                                        key={convo._id} 
                                        className={styles.searchResultItem}
                                        onClick={() => startChat(convo)}
                                    >
                                        <span><strong>{convo.username}</strong></span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recent conversations.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <strong>Chatting with: {receiver.username}</strong>
                        <button 
                            onClick={() => { setActiveChat(false); setReceiver(null); setMessages([]); }} 
                            className={styles.closeButton}
                        >
                            Close
                        </button>
                    </div>
                    
                    <ul className={styles.messageList}>
                        {messages.map((msg, idx) => {
                            const isMe = msg.senderId === user._id
                            return (
                                <li key={idx} className={`${styles.messageItem} ${isMe ? styles.myMessage : styles.otherMessage}`}>
                                    <span className={styles.messageBubble}>
                                        {msg.content}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>

                    <form onSubmit={sendMessage} className={styles.messageForm}>
                        <input 
                            type="text" 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Type a message..." 
                            className={styles.messageInput}
                        />
                        <button type="submit" className={styles.sendButton}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </main>
    )
}