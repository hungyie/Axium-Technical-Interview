import React from 'react';

// TypingIndicator 组件
// 用来显示 "AI 正在输入..." 的提示气泡，常见于聊天应用中
const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600 mr-2">AI is typing</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
