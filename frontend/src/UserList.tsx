import { useEffect, useState } from "react";

function UserList() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response =
      await fetch("http://localhost:8080/users");

    const data = await response.json();

    setUsers(data);
  };

  return (
    <div>
      <h1>蔵書管理システム</h1>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>氏名</th>
            <th>メールアドレス</th>
            <th>社員コード</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.employee_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;