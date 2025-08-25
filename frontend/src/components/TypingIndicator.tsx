import React from 'react';

// TypingIndicator 组件
// 用来显示 "AI 正在输入..." 的提示气泡，常见于聊天应用中
const TypingIndicator: React.FC = () => {
  return (
    // 外层容器：左对齐 (AI 回复在左边)，底部有间距
    <div className="flex justify-start mb-4">
      {/* 限制最大宽度，避免气泡太宽 */}
      <div className="max-w-xs lg:max-w-md">
        {/* 消息气泡样式：灰色背景、黑色文字、圆角、内边距、阴影 */}
        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-1">
            {/* 文本提示 */}
            <span className="text-sm text-gray-600 mr-2">AI is typing</span>

            {/* 三个小圆点动画区域 */}
            <div className="flex space-x-1">
              {/* 每个小圆点都带有 class typing-dot，用来做动画 (比如闪烁/跳动) */}
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
