import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Zap, Shield, Code } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="text-blue-500" size={28} />
          AI Chat
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          Your Personal AI Assistant
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Chat with advanced AI models, get instant answers, and boost your productivity with our platform.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition"
        >
          Get Started Free
        </button>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-8">
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap size={24} />
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Get responses instantly powered by state-of-the-art AI</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield size={24} />
            </div>
            <h3 className="font-semibold mb-2">100% Private</h3>
            <p className="text-gray-400 text-sm">Your conversations are encrypted and secure</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code size={24} />
            </div>
            <h3 className="font-semibold mb-2">Code Expert</h3>
            <p className="text-gray-400 text-sm">Perfect for programming help and technical questions</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-semibold mb-2">Chat History</h3>
            <p className="text-gray-400 text-sm">Save and access all your previous conversations</p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-dark-tertiary mt-20 py-8 text-center text-gray-500">
        <p>© 2025 AI Chat Clone. Built with ❤️ using React and AI.</p>
      </div>
    </div>
  );
}
