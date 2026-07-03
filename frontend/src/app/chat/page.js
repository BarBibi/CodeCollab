'use client'

import { useEffect, useState } from 'react'
// import { io } from 'socket.io-client' // To be implemented with SocketContext

export default function ChatPage() {
    const [messages, setMessages] = useState([])
    const [currentMessage, setCurrentMessage] = useState('')

    useEffect(() => {
        // TODO: Initialize socket connection and listen for 'receive_message'
    }, [])

    const sendMessage = () => {
        if (!currentMessage.trim()) return
        // TODO: Emit 'send_message' via socket
        setCurrentMessage('')
    }

    return (
        <main>
            <h2>Developer Lounge (Chat)</h2>
            <div>
                <ul style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc' }}>
                    {messages.map((msg, idx) => (
                        <li key={idx}>{msg.content}</li>
                    ))}
                </ul>
            </div>
            <div>
                <input 
                    type="text" 
                    value={currentMessage} 
                    onChange={(e) => setCurrentMessage(e.target.value)} 
                    placeholder="Type a message..." 
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </main>
    )
}