/*import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState<string>('読み込み中...');

  useEffect(() => {
    // Spring BootのAPIを呼び出す
    fetch('http://localhost:8080/api/data')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => {
        console.error('エラーが発生しました:', error);
        setMessage('データの取得に失敗しました。');
      });
  }, []);

  return (
    <div style={{ padding: '20px', textBreak: 'break-all' }}>
      <h1>React × Spring Boot 連携テスト</h1>
      <p>バックエンドからのメッセージ：<strong>{message}</strong></p>
    </div>
  );
}

export default App;*/

import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserList from "./UsersList";
import UserEdit from "./UserEdit";
import Login from "./Login";
import PasswordReset from "./passwordReset";

import HomePage from "./HomePage";
import Home from "./Home";
import UserManagement from "./UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン画面 */}
        <Route path="/" element={<Login />} />

        {/* ユーザー管理（main） */}
        <Route path="/UsersList" element={<UserList />} />
        <Route path="/users/:id" element={<UserEdit />} />
        <Route path="/passwordReset" element={<PasswordReset />} />

        {/* 書籍管理（feature/oka） */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/books" element={<Home />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;