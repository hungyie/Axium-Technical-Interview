import React, { useState, useRef, useEffect } from 'react';
import { ChatRequest, ModelInfo } from '../types/api';

// ChatInput 的 props 定义
interface ChatInputProps {
  onSendMessage: (request: ChatRequest) => void; 
  isLoading: boolean;                            
  models: ModelInfo[];                           
}

// ChatInput 组件：负责输入消息 & 参数设置 & 发送
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, models }) => {
  // -----------------------
  // 局部状态 (Local State)
  // -----------------------
  const [message, setMessage] = useState('');                
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo'); 
  const [temperature, setTemperature] = useState(0.7);       
  const [maxTokens, setMaxTokens] = useState(150);           
  const [showSettings, setShowSettings] = useState(false);   
  const [useStreaming, setUseStreaming] = useState(false);   
  const textareaRef = useRef<HTMLTextAreaElement>(null);    

  // 自动调整 textarea 高度 (根据内容行数扩展)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // 提交表单 (发送消息)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 阻止页面刷新
    if (message.trim() && !isLoading) {
      const request: ChatRequest = {
        message: message.trim(),
        model: selectedModel,
        temperature,
        max_tokens: maxTokens,
        stream: useStreaming,
      };
      onSendMessage(request); // 调用父组件的回调函数
      setMessage('');         // 清空输入框
    }
  };

  // 处理键盘事件 (Enter=发送, Shift+Enter=换行)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* 设置面板 (可展开/收起) */}
      {showSettings && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Chat Settings</h3>
          
          {/* 三栏布局：模型选择 / Temperature / Max Tokens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* 模型选择下拉框 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature 滑块 (0~2) */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Max Tokens 输入框 */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Tokens</label>
              <input
                type="number"
                min="1"
                max="4000"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* 流式响应切换开关 */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-gray-600">Streaming Response</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {useStreaming ? '实时显示 AI 回复过程' : '等待完整回复后显示'}
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useStreaming}
                    onChange={(e) => setUseStreaming(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    useStreaming ? 'bg-primary-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mt-1 ${
                      useStreaming ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 消息输入区域 */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          {/* 多行输入框 (支持自动换行/高度自适应) */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={1}
            maxLength={1000}
            disabled={isLoading}
          />
          {/* 输入框下方：字符计数 + 设置面板切换按钮 */}
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">{message.length}/1000 characters</span>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs text-primary-600 hover:text-primary-700 focus:outline-none"
            >
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
          </div>
        </div>

        {/* 发送按钮 */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading} // 没输入或正在加载时禁用
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            // Loading 状态 → 显示转圈动画
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
