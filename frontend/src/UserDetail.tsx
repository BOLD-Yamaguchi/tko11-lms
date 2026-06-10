import { useParams } from "react-router-dom";

function UserDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>ユーザー詳細画面</h1>
      <p>ユーザーID: {id}</p>
    </div>
  );
}

export default UserDetail;