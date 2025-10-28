import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function Sidebar({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  isOpen,
  setSidebarOpen
}) {
  const [expandedId, setExpandedId] = useState(null);

  const uniqueChats = Array.from(
    new Map(chats.map(chat => [chat._id, chat])).values()
  );

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 bottom-0 w-64 bg-linear-to-b from-slate-900 to-slate-950 border-r border-slate-700/50
        transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:top-0 md:border-r md:border-slate-700/50
        flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900
        shadow-xl md:shadow-none
      `}>
        
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-[calc(100%-2rem)] mx-4 my-4 px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
                     flex items-center justify-center gap-2 transition-all duration-200 font-semibold text-white shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* Chat History */}
        <div className="px-2 space-y-2 flex-1 overflow-y-auto">
          <p className="text-xs uppercase text-gray-500 font-semibold px-3 py-3 tracking-wider">Chat History</p>
          
          {uniqueChats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-gray-400 text-sm">No chats yet</p>
              <p className="text-gray-600 text-xs mt-2">Start a conversation to see history</p>
            </div>
          ) : (
            <div className="space-y-1">
              {uniqueChats.map((chat) => (
                <div
                  key={chat._id}
                  className={`
                    group relative px-3 py-3 rounded-xl cursor-pointer transition-all duration-200
                    ${currentChatId === chat._id 
                      ? 'bg-linear-to-r from-blue-600/30 to-cyan-600/30 text-white border border-blue-500/50 shadow-lg' 
                      : 'hover:bg-slate-800/50 text-gray-300 border border-transparent hover:border-slate-700'
                    }
                  `}
                  onClick={() => {
                    onSelectChat(chat._id);
                    if (setSidebarOpen) setSidebarOpen(false); // ✅ Auto close on mobile
                  }}
                  onMouseEnter={() => setExpandedId(chat._id)}
                  onMouseLeave={() => setExpandedId(null)}
                >
                  {/* Chat Title - Truncated */}
                  <div className="flex-1 truncate text-sm font-medium line-clamp-2">
                    {chat.title || 'New Chat'}
                  </div>
                  
                  {/* Chat Date */}
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(chat.updatedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this chat permanently?')) {
                        onDeleteChat(chat._id);
                      }
                    }}
                    className={`
                      absolute right-2 top-3 p-2 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100
                      transition-all duration-200 bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300
                    `}
                    title="Delete chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-linear-to-t from-slate-950 to-transparent border-t border-slate-700/50">
          <p className="text-xs text-gray-500 text-center">
            Conversations are encrypted
          </p>
        </div>
      </div>

      {/* ✅ Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        />
      )}
    </>
  );
}
