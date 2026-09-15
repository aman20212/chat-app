import { useState } from 'react'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [provider, setProvider] = useState('ollama')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (loading) return
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, messages: newMessages }),
      })

      const data = await res.json()

      if (data.error) {
        setMessages([...newMessages, { role: 'error', content: data.error }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'error', content: 'Could not reach the backend. Is it running?' }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[600px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h1 className="text-lg font-semibold text-gray-800">AI Chat</h1>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setProvider('ollama')}
                className={`px-3 py-1 text-sm cursor-pointer rounded-full transition ${
                  provider === 'ollama' ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                Ollama
              </button>
              <button
                onClick={() => setProvider('groq')}
                className={`px-3 py-1 text-sm rounded-full cursor-pointer transition ${
                  provider === 'groq' ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                Groq
              </button>
            </div>
            <button
              onClick={clearChat}
              className="text-sm px-3 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-100 cursor-pointer transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => {
            if (msg.role === 'error') {
              return (
                <div key={i} className="flex justify-center">
                  <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-lg">
                    {msg.content}
                  </div>
                </div>
              )
            }
            const isUser = msg.role === 'user'
            return (
              <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-200 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-500 text-sm px-4 py-2 rounded-2xl rounded-bl-sm">
                thinking...
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={loading ? 'Waiting for response...' : 'Type a message...'}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium disabled:bg-blue-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App