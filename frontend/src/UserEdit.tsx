import { useParams } from "react-router-dom";

function UserEdit() {
  // URLのユーザーIDを取得し、編集対象の識別に使用する。
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
