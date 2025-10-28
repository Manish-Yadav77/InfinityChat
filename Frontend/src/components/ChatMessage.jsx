import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ChatMessage({ message, isUser }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-3 animate-fade-in">
        <div className="max-w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          {message.files && message.files.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-blue-500 pt-3">
              {message.files.map((file, idx) => (
                <div key={idx} className="text-xs font-medium bg-blue-500/30 px-3 py-2 rounded-lg flex items-center gap-2">
                  <span>📎</span>
                  <span className="truncate">{file.filename}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-4 py-3 animate-fade-in hover:bg-slate-900/30 transition-colors group">
      <div className="max-w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]">
        <div className="px-4 py-3 rounded-xl bg-slate-800 text-gray-50 relative shadow-md hover:shadow-lg transition-all">
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words font-normal">
            {message.content}
          </div>

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 
                       transition-all duration-200 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white"
            title="Copy message"
          >
            {copied ? (
              <Check size={18} className="text-green-400" />
            ) : (
              <Copy size={18} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}