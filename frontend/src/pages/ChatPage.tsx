import React, { useState, useEffect, useRef } from 'react';
import { ApiService } from '../services/api';
import { ChatRequest, ModelInfo } from '../types/api';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';


const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{
    id: number, 
    role: 'user' | 'assistant', 
    content: string, 
    timestamp: string, 
    model_used?: string
  }>>([]); 

  const [isLoading, setIsLoading] = useState(false); 
  const [models, setModels] = useState<ModelInfo[]>([]); 
  const [error, setError] = useState<string | null>(null); 

  const messagesEndRef = useRef<HTMLDivElement>(null); 

  // -----------------------
  // 滚动逻辑 (Side Effect)
  // -----------------------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 每当 messages 或 isLoading 改变时，自动滚动到最底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // -----------------------
  // 初始化逻辑 (Page init)
  // -----------------------
  useEffect(() => {
    const initializePage = async () => {
      try {
        setError(null);
        
        // 加载模型列表
        const modelsResponse = await ApiService.getModels();
        setModels(modelsResponse.models);
      } catch (error: any) {
        console.error('Failed to initialize chat page:', error);
        setError('Failed to load models. Please refresh the page.');
      }
    };

    initializePage();
  }, []);

  // -----------------------
  // 消息处理逻辑 (Message handling)
  // -----------------------
  const handleSendMessage = async (request: ChatRequest) => {
    // 添加用户消息到聊天记录
    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: request.message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      if (request.stream) {
        // 流式响应模式
        await handleStreamingResponse(request);
      } else {
        // 标准响应模式
        await handleStandardResponse(request);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setError(error.message || 'Failed to get response from AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理标准响应
  const handleStandardResponse = async (request: ChatRequest) => {
    const response = await ApiService.sendChatMessage(request);
    
    // 添加 AI 回复到聊天记录
    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant' as const,
      content: response.response,
      timestamp: new Date().toISOString(),
      model_used: response.model_used
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };

  // 处理流式响应
  const handleStreamingResponse = async (request: ChatRequest) => {
    let assistantMessageId = Date.now() + 1;
    let streamingContent = '';
    
    // 创建初始的助手消息（空内容）
    const initialAssistantMessage = {
      id: assistantMessageId,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date().toISOString(),
      model_used: request.model || 'gpt-3.5-turbo'
    };
    
    setMessages(prev => [...prev, initialAssistantMessage]);
    
    await ApiService.sendChatMessageStream(request, {
      onStart: (data) => {
        console.log('Stream started:', data);
      },
      onContent: (data) => {
        if (data.content) {
          streamingContent += data.content;
          // 实时更新消息内容
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: streamingContent }
                : msg
            )
          );
        }
      },
      onEnd: (data) => {
        console.log('Stream ended:', data);
        // 确保最终内容是完整的
        if (data.full_response) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { 
                    ...msg, 
                    content: data.full_response || '',
                    model_used: data.model_used || msg.model_used
                  }
                : msg
            )
          );
        }
      },
      onError: (data) => {
        console.error('Stream error:', data);
        setError(data.error || 'Streaming failed');
        // 移除失败的消息
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      }
    });
  };

  // 清空聊天记录
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // -----------------------
  // 页面渲染
  // -----------------------
  return (
    <div className="h-full flex flex-col">
      {/* 页面级错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 m-4 mb-0">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 工具栏 */}
      <div className="flex justify-between items-center p-4 pb-0">
        <h2 className="text-lg font-semibold text-gray-900">AI Chat</h2>
        <button
          onClick={clearChat}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* 聊天消息区 (带滚动条) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {messages.length === 0 && !isLoading ? (
          // 空状态提示
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Ask questions, get help with coding, or just have a chat. 
              Choose your preferred AI model and start chatting!
            </p>
          </div>
        ) : (
          // 渲染消息列表
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
            {isLoading && <TypingIndicator />} 
          </div>
        )}
        {/* 底部锚点，用于自动滚动 */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入框组件 */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        models={models}
      />
    </div>
  );
};

export default ChatPage;
