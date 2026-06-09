import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function CreateBook() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const bookData = { title };

    try {
      const response = await fetch(`http://localhost:8080/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        alert('登録が完了しました！');
        setTitle('');
      } else {
        alert('登録に失敗しました。');
      }
      navigate("/");
    } catch (error) {
      console.error('通信エラー:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>タイトル: </label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <button type="submit">登録する</button>
      <br />
      <Link to="/">Ｔｏｐページへ</Link>
      <br />
      <Link to="/delete">削除ページへ</Link>
    </form>
  );
}

export default CreateBook;