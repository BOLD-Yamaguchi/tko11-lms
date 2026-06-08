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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function App() {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response =
      await fetch("http://localhost:8080/books");
      //await fetch("http://localhost:5173/books");

    const data = await response.json();

    setBooks(data);
  };

  return (
    <div>
      <h1>蔵書管理システム</h1>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>タイトル</th>
          </tr>
        </thead>

        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/create">登録ページへ</Link>
      <Link to="/delete">削除ページへ</Link>
    </div>
  );
}

export default App;