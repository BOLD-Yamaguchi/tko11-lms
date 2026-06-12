import { useParams } from "react-router-dom";

function UserEdit() {
  const { id } = useParams();

  return (
    <div>
      <h1>ユーザー編集画面</h1>
      <p>ユーザーID: {id}</p>
      <p>ユーザー情報の編集が可能です。</p>
    </div>
  );
}

export default UserEdit;