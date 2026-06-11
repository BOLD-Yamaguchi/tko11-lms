import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserList from "./UsersList";
import UserEdit from "./UserEdit";
import Login from "./Login";
import PasswordReset from "./passwordReset";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン画面 */}
        <Route path="/" element={<Login />} />
        {/* ユーザー一覧画面 */}
        <Route path="/UsersList" element={<UserList />} />

        {/* ユーザー詳細画面 */}
        <Route path="/users/:id" element={<UserEdit />} />
        {/* パスワードリセット画面 */}
        <Route path="/passwordReset" element={<PasswordReset />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
