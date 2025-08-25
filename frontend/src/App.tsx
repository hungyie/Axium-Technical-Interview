import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';

/**
 * App 组件 - 应用程序根组件
 * 
 * 功能：
 * - 配置 React Router 路由
 * - 提供 Layout 布局包装
 * - 定义页面路由映射
 * 
 * 架构说明：
 * - 使用 BrowserRouter 提供路由功能
 * - Layout 组件提供统一的页面布局和导航
 * - ChatPage 组件专注于聊天功能实现
 * - 保持设计一致性和代码模块化
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 聊天页面 - 默认首页 */}
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
