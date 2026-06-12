import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//型定義を追加
interface Book {
  id: number;
  title: string;
}

function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response =
      await fetch("http://localhost:8080/books");
      //fetch("http://localhost:8080/books");

    const data = await response.json();

    setBooks(data);
  };

  return (
    <div>
      <h1>蔵書管理システムマイページ</h1>

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
      <br />
      <Link to="/delete">削除ページへ</Link>
      <br />
      <Link to="/home">Ｔｏｐページへ</Link>
      <br />
    </div>
  );
}

export default Home;
