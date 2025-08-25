import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';


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
