import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserList from "./UsersList";
import UserEdit from "./UserEdit";
import Login from "./Login";
import PasswordReset from "./passwordReset";

import HomePage from "./HomePage";
import Home from "./Home";
import UserManagement from "./UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン画面 */}
        <Route path="/" element={<Login />} />

        {/* ユーザー管理（main） */}
        <Route path="/UsersList" element={<UserList />} />
        <Route path="/users/:id" element={<UserEdit />} />
        <Route path="/passwordReset" element={<PasswordReset />} />

        {/* 書籍管理（feature/oka） */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/books" element={<Home />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;