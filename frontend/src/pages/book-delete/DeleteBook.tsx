import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function DeleteBook() {
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleDelete = async (id:string) => {

    const bookData = { id };

    try {
      //const response = await fetch(`http://localhost:8080/books/${id}`, {
      void fetch(`http://localhost:8080/books/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(bookData),
      });

      /*if (response.ok) {
        alert('削除が完了しました！');;
        setId('');
      } else {
        alert('削除に失敗しました。');
      }*/
      alert('削除が完了しました！');;
      navigate("/");
    } catch (error) {
      console.error('通信エラー:', error);
    }
  };

  return (
    <form>
      <div>
        <label>ＩＤ: </label>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
      </div>
      <button onClick={() => handleDelete(id) }>削除する</button>
      <br />
      <Link to="/">Ｔｏｐページへ</Link>
      <br />
      <Link to="/create">登録ページへ</Link>
    </form>
  );
}

export default DeleteBook;
