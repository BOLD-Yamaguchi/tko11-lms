import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserList from "./UsersList";
import UserDetail from "./UserDetail";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン画面 */}
        <Route path="/" element={<Login />} />
        {/* ユーザー一覧画面 */}
        <Route path="/UsersList" element={<UserList />} />

        {/* ユーザー詳細画面 */}
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;





















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

//import { BrowserRouter, Routes, Route } from "react-router-dom";
//import Home from "./Home";
//import CreateBook from "./CreateBook";
//import DeleteBook from "./DeleteBook";
//
//function App() {
//  return (
//    <BrowserRouter>
//      <Routes>
//        <Route path="/" element={<Home />} />
//        <Route path="/create" element={<CreateBook />} />
//        <Route path="/delete" element={<DeleteBook />} />
//      </Routes>
//    </BrowserRouter>
//  );
//}
//
//export default App;





