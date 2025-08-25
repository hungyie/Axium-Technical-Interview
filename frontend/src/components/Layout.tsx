import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout 组件 - 提供统一的页面布局框架
 * 
 * 功能：
 * - 顶部导航栏（Header）
 * - 统一的页面容器和样式
 * 
 * 所有页面都会被这个 Layout 包裹，确保设计一致性
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation(); // 获取当前路由位置

  // 导航菜单项 - 只保留 Chat
  const navigationItems = [
    { path: '/', label: 'Chat', icon: '💬' },
  ];

  // -----------------------
  // 主布局渲染
  // -----------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部 Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Culinary Assistant</h1>
              <p className="text-sm text-gray-600">
                AI-powered recipe generation from your ingredients
              </p>
            </div>
          </div>
          
          {/* 导航菜单 */}
          <nav className="mt-4">
            <div className="flex space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
