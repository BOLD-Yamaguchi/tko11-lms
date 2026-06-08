import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function CreateBook() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = { title };

    try {
      const response = await fetch('http://localhost:8080/books', {
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
      <button type="submit" onClick={() => navigate("/")}>登録する</button>
    </form>
  );
}

export default CreateBook;