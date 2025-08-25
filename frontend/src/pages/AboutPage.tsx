import React from 'react';

/**
 * AboutPage 组件 - 关于页面
 * 
 * 功能：
 * - 显示项目介绍
 * - 技术栈说明
 * - 功能特性列表
 * - 使用说明
 * 
 * 这是一个静态信息页面，展示应用的相关信息
 */
const AboutPage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            关于 LLM Practice
          </h1>
          <p className="text-lg text-gray-600">
            一个用于学习和实践大语言模型集成的全栈应用
          </p>
        </div>

        {/* 项目介绍 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            项目目标
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              这个项目旨在提供一个完整的学习环境，帮助开发者了解如何构建一个现代化的全栈应用，
              并集成大语言模型（LLM）服务。通过实际的代码实现，学习前后端分离架构、
              API 设计、数据库操作、以及 AI 服务集成等核心技能。
            </p>
          </div>
        </section>

        {/* 技术栈 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🛠️</span>
            技术栈
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* 后端技术 */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">后端 (Backend)</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  FastAPI - 现代化的 Python Web 框架
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  SQLAlchemy - ORM 数据库操作
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  PostgreSQL - 生产级关系数据库
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  OpenAI API - 大语言模型服务
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Pydantic - 数据验证和序列化
                </li>
              </ul>
            </div>

            {/* 前端技术 */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">前端 (Frontend)</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  React 18 - 现代化前端框架
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  TypeScript - 类型安全的 JavaScript
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  React Router - 客户端路由管理
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Tailwind CSS - 实用优先的 CSS 框架
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Axios - HTTP 客户端库
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 功能特性 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">✨</span>
            功能特性
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🤖 AI 聊天</h4>
              <p className="text-gray-600 text-sm">
                与多种 AI 模型进行对话，支持参数调节
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🎛️ 模型选择</h4>
              <p className="text-gray-600 text-sm">
                支持 GPT-3.5、GPT-4 等多种模型切换
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">⚙️ 参数调节</h4>
              <p className="text-gray-600 text-sm">
                可调节温度、最大令牌数等生成参数
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">📊 状态监控</h4>
              <p className="text-gray-600 text-sm">
                实时显示 API 连接状态和系统健康度
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🎨 响应式设计</h4>
              <p className="text-gray-600 text-sm">
                适配桌面和移动设备的现代化界面
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🔧 模块化架构</h4>
              <p className="text-gray-600 text-sm">
                清晰的代码结构，易于扩展和维护
              </p>
            </div>
          </div>
        </section>

        {/* 学习要点 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📚</span>
            学习要点
          </h2>
          <div className="bg-yellow-50 rounded-lg p-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-3 mt-1">▶</span>
                <div>
                  <strong>全栈开发：</strong>学习前后端分离架构，理解 RESTful API 设计原则
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-3 mt-1">▶</span>
                <div>
                  <strong>AI 集成：</strong>掌握如何在应用中集成大语言模型服务
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-3 mt-1">▶</span>
                <div>
                  <strong>现代化工具：</strong>使用最新的开发工具和最佳实践
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-3 mt-1">▶</span>
                <div>
                  <strong>类型安全：</strong>通过 TypeScript 和 Pydantic 确保代码质量
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-3 mt-1">▶</span>
                <div>
                  <strong>错误处理：</strong>学习健壮的错误处理和用户体验设计
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* 版本信息 */}
        <section className="text-center">
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-600 text-sm">
              Version 1.0.0 | Built with ❤️ for learning
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Last updated: {new Date().toLocaleDateString('zh-CN')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
