import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { deleteBook } from "../../api/booksApi";
import { bookIdSchema } from "../../schemas/bookSchema";

function DeleteBook() {
  // 削除対象の書籍IDとZod検証エラーを、削除を確定するまで保持する。
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = bookIdSchema.safeParse(id);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? '書籍IDを確認してください。');
      return;
    }

    try {
      await deleteBook(result.data);
      alert('削除が完了しました！');;
      setId('');
      setError('');
      navigate("/");
    } catch (error) {
      console.error('通信エラー:', error);
    }
  };

  return (
    <form onSubmit={handleDelete} noValidate>
      <div>
        <label>ＩＤ: </label>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        {error && <p className="field-error">{error}</p>}
      </div>
      <button type="submit">削除する</button>
      <br />
      <Link to="/">Ｔｏｐページへ</Link>
      <br />
      <Link to="/create">登録ページへ</Link>
    </form>
  );
}

export default DeleteBook;
