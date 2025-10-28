import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, Send, Loader, Settings, X, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import FileUpload from '../components/FileUpload';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { chatId } = useParams();

  // State
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const historyLoadedRef = useRef(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Load chat history on mount - ONCE ONLY
  useEffect(() => {
    if (!historyLoadedRef.current && user) {
      loadChatHistory();
      historyLoadedRef.current = true;
    }
  }, [user]);

  // Load specific chat
  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    } else {
      setMessages([]);
      setCurrentChat(null);
    }
  }, [chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getHistory();
      setChatHistory(response.data.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadChat = async (id) => {
    try {
      setLoading(true);
      const response = await chatAPI.getChat(id);
      setCurrentChat(response.data.data);
      setMessages(response.data.data.messages);
    } catch (error) {
      console.error('Error loading chat:', error);
      alert('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChat(null);
    setMessages([]);
    setInputValue('');
    setSelectedFiles([]);
    navigate('/home');
    setSidebarOpen(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && selectedFiles.length === 0) return;

    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('message', inputValue);
      if (currentChat) {
        formData.append('chatId', currentChat._id);
      }
      formData.append('userId', user._id);

      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Add user message to UI immediately
      const userMessage = {
        role: 'user',
        content: inputValue,
        files: selectedFiles.map(f => ({
          filename: f.name,
          size: f.size,
          mimetype: f.type
        }))
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setSelectedFiles([]);

      // Send to API
      const response = await chatAPI.sendMessage(formData);

      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data.data.message
      };
      setMessages(prev => [...prev, aiMessage]);

      // Update current chat
      if (!currentChat) {
        setCurrentChat({ _id: response.data.data.chatId, ...response.data.data });
        navigate(`/home/${response.data.data.chatId}`);
      }

      // Smart update of chat history
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(c => c._id === response.data.data.chatId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            title: response.data.data.title,
            updatedAt: new Date().toISOString()
          };
          return updated;
        } else {
          return [
            {
              _id: response.data.data.chatId,
              title: response.data.data.title,
              updatedAt: new Date().toISOString()
            },
            ...prev
          ];
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.response?.data?.message || 'Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      await chatAPI.deleteChat(id);
      setChatHistory(chatHistory.filter(chat => chat._id !== id));
      if (currentChat?._id === id) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  const handleSelectChat = (id) => {
    navigate(`/home/${id}`);
    setSidebarOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-950 to-slate-900 text-white overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar
        chats={chatHistory}
        currentChatId={currentChat?._id}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-screen">
        
        {/* Navbar */}
        <Navbar
          onNewChat={handleNewChat}
          openSettings={() => setShowSettings(true)}
          currentChatTitle={currentChat?.title}
        />

        {/* Chat Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pt-16 pb-4 scroll-smooth">
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
            
            {/* Welcome Section - Full height when no messages */}
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
                <div className="text-center w-full max-w-2xl">
                  <div className="mb-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Welcome, {user?.name}!
                  </h2>
                  <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
                    Start a conversation with AI. Ask anything you'd like help with.
                  </p>
                  
                  {/* Quick Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div 
                      className="p-4 sm:p-5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-105 border border-slate-700 hover:border-blue-500/50"
                      onClick={() => setInputValue('Explain quantum computing in simple terms')}
                    >
                      <p className="font-semibold text-base text-blue-400 mb-2">💡 Quick Explanation</p>
                      <p className="text-sm text-gray-400">Get instant explanations</p>
                    </div>
                    
                    <div 
                      className="p-4 sm:p-5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-105 border border-slate-700 hover:border-blue-500/50"
                      onClick={() => setInputValue('Create a React component for a form')}
                    >
                      <p className="font-semibold text-base text-blue-400 mb-2">⚙️ Code Snippets</p>
                      <p className="text-sm text-gray-400">Generate code examples</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Area */}
            {messages.length > 0 && (
              <div className="w-full">
                <div className="space-y-1 pb-8">
                  {messages.map((message, idx) => (
                    <ChatMessage
                      key={idx}
                      message={message}
                      isUser={message.role === 'user'}
                    />
                  ))}

                  {/* Loading Indicator */}
                  {loading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex justify-start px-4 py-4">
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} className="h-8" />
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="shrink-0 bg-linear-to-t from-slate-950 via-slate-900 to-transparent pt-6 pb-4 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            
            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} attached
                  </span>
                </div>
                <FileUpload 
                  selectedFiles={selectedFiles}
                  onFilesSelected={setSelectedFiles}
                />
              </div>
            )}

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-3">
              {/* File Upload Button */}
              <div className="shrink-0">
                <FileUpload 
                  selectedFiles={selectedFiles}
                  onFilesSelected={setSelectedFiles}
                />
              </div>

              {/* Input Field */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message here..."
                  disabled={loading}
                  className="w-full px-4 py-3 sm:py-4 bg-slate-800 border border-slate-700 
                            rounded-xl text-white placeholder-gray-500 focus:outline-none 
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-200"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || (!inputValue.trim() && selectedFiles.length === 0)}
                className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                          disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed
                          text-white font-semibold rounded-xl transition-all duration-200
                          flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span className="hidden sm:inline">Sending</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Info */}
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-3">
              Your conversations are encrypted and private • Powered by AI
            </p>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-700">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                
                {/* User Info Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Account
                  </label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <span className="text-gray-400">Name</span>
                      <span className="text-white font-medium">{user?.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <span className="text-gray-400">Email</span>
                      <span className="text-white font-medium text-xs sm:text-sm truncate">{user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* AI Model Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Model
                  </label>
                  <div className="p-3 rounded-lg bg-linear-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30">
                    <p className="text-white font-medium">Gemini 2.5 Flash</p>
                    <p className="text-xs text-gray-400 mt-1">Advanced AI Model</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                            text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-18 -right-6 md:hidden p-3 bg-linear-to-r from-blue-600 to-blue-700 
                   hover:from-blue-700 hover:to-blue-800 rounded-full shadow-lg transition-all duration-200
                   z-40 active:scale-95"
      >
        <Circle size={24} />
      </button>
    </div>
  );
}