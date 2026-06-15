import { Link } from "react-router-dom";

function UserManagement() {
  return (
    <div>
      <h2>ユーザー管理</h2>
      <Link to="/home">トップページへ</Link>
    </div>
  );
}

export default UserManagement;