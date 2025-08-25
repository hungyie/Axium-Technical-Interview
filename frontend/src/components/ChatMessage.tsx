import React from 'react';

// 定义一条消息的数据结构
interface Message {
  id: number;                        // 唯一ID (时间戳或UUID)
  role: 'user' | 'assistant';        // 消息发送方 (用户 / AI 助手)
  content: string;                   // 消息内容
  timestamp: string;                 // 消息时间 (ISO 格式)
  model_used?: string;               // (可选) 使用的模型名称 (仅AI回复时存在)
}

// ChatMessage 组件需要接收的属性 (props)
interface ChatMessageProps {
  message: Message;                  // 要展示的那条消息
  isLatest?: boolean;                // 是否是最后一条消息 (用于额外样式/动画)
}

// 单条聊天消息组件
const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest = false }) => {
  // 格式化时间戳 (转成 “HH:MM” 格式的本地时间)
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 判断消息是否来自用户 (决定UI对齐 & 样式)
  const isUser = message.role === 'user';

  return (
    <div className={`message-fade-in ${isLatest ? 'mb-4' : 'mb-6'}`}>
      {/* 外层容器：根据角色决定消息在左边还是右边 */}
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className="max-w-xs lg:max-w-md">
          {/* 消息气泡 */}
          <div
            className={`rounded-lg px-4 py-2 shadow-sm ${
              isUser
                ? 'bg-primary-500 text-white'   // 用户消息 → 蓝色背景，白字
                : 'bg-gray-100 text-gray-800'   // 助手消息 → 灰色背景，黑字
            }`}
          >
            {/* 消息内容 */}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>

          {/* 时间戳 & 模型信息 (只在助手回复时显示模型) */}
          <div
            className={`flex ${
              isUser ? 'justify-end' : 'justify-between'
            } items-center mt-1`}
          >
            {/* 如果是助手消息并且有 model_used，就显示模型名 */}
            {!isUser && message.model_used && (
              <span className="text-xs text-gray-500">
                {message.model_used}
              </span>
            )}
            {/* 时间戳 (始终显示) */}
            <span className="text-xs text-gray-500">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
