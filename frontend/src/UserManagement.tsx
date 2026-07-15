import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import type { HamburgerMenuItem } from "./components/HamburgerMenu";
import { TextBox } from "./components/TextBox";

import { API_BASE_URL } from "./constants/api";      //接続サーバのアドレス 20260715

function UserManagement() {
  const navigate = useNavigate();

  // 操作選択 ("create" = 新規ユーザー登録, "reset" = パスワードリセット)
  const [operation, setOperation] = useState<"create" | "reset">("create");

  // フォームの入力状態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("0"); // 0: 東京, 1: 大阪
  const [role, setRole] = useState("0"); // 0: 一般ユーザー, 1: 貸出ユーザー, 2: 管理者
  const [employeeCode, setEmployeeCode] = useState("");

  const menuItems: HamburgerMenuItem[] = [
    { id: "home", label: "ホーム", description: "トップ画面へ移動" },
    { id: "books", label: "書籍管理", description: "書籍一覧を表示" },
    { id: "UsersList", label: "ユーザー管理", description: "ユーザー管理画面を表示" },
  ];

  const handleMenuSelect = (item: HamburgerMenuItem) => {
    switch (item.id) {
      case "home":
        navigate("/");
        break;
      case "books":
        navigate("/books");
        break;
      case "UsersList":
        navigate("/UsersList");
        break;
    }
  };

  const isPasswordMismatch = password !== "" && confirmPassword !== "" && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 簡単なバリデーション
    if (!email) {
      alert("ユーザーID（メールアドレス）は必須です。");
      return;
    }
    if (!password) {
      alert("パスワードは必須です。");
      return;
    }
    if (password !== confirmPassword) {
      alert("パスワードが一致していません。");
      return;
    }

    if (operation === "create") {
      if (!name || !employeeCode) {
        alert("氏名、社員コードは必須です。");
        return;
      }

      const payload = {
        username: name,
        mailAddress: email,
        password,
        employeeCode: employeeCode,
        affiliationKbn: Number(department),
        adminKbn: 0, //明示的に 0 固定
      };

      console.log("新規登録実行:", payload);
      try {
        const response = await fetch(`${API_BASE_URL}/users`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("登録に失敗しました");
        }

        alert("ユーザーを新規登録しました。");
      } catch (error) {
        console.error(error);
        alert("通信エラーが発生しました。");
        return;
      }
    } else {
      // パスワードリセットのAPIリクエスト（Controllerの @PutMapping("/password-reset") に対応）
      const payload = {
        mailAddress: email,
        password: password,
      };

      console.log("パスワードリセット実行:", payload);
      try {
        const response = await fetch(`${API_BASE_URL}/users/password-reset`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("パスワードリセットに失敗しました");
        }
        alert("パスワードをリセットしました。");
      } catch (error) {
        console.error(error);
        alert("通信エラーが発生しました。");
        return;
      }
    }

    navigate("/UsersList");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Header
        title="書籍貸出管理システム"
        eyebrow="BOOK MANAGEMENT SYSTEM"
        menuItems={menuItems}
        onMenuSelect={handleMenuSelect}
      />

      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
        <div style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "30px",
          boxSizing: "border-box"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#333" }}>ユーザー管理画面</h2>

          <form onSubmit={handleSubmit}>
            {/* 操作選択 */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>操作選択</label>
              <div style={{ display: "flex", gap: "20px" }}>
                <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="radio"
                    name="operation"
                    value="create"
                    checked={operation === "create"}
                    onChange={() => setOperation("create")}
                  />
                  新規ユーザー登録
                </label>
                <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="radio"
                    name="operation"
                    value="reset"
                    checked={operation === "reset"}
                    onChange={() => setOperation("reset")}
                  />
                  パスワードリセット
                </label>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "20px 0" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#666" }}>ユーザー情報入力エリア</h3>

              {/* ユーザーID (メールアドレス) */}
              <TextBox
                label="ユーザーID（メールアドレス）"
                value={email}
                onChange={setEmail}
                placeholder="user@example.com"
                required={true}
              />

              {/* パスワード / 新パスワード */}
              <TextBox
                label={operation === "create" ? "パスワード" : "新パスワード"}
                value={password}
                onChange={setPassword}
                placeholder="パスワードを入力"
                required={true}
              />

              {/* パスワード再入力 */}
              <TextBox
                label={operation === "create" ? "パスワード再入力" : "新パスワード再入力"}
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="もう一度パスワードを入力"
                required={true}
                helperText={isPasswordMismatch ? "パスワードが一致しません" : ""}
              />

              {/* 新規登録時のみ表示・活性化するエリア */}
              {operation === "create" ? (
                <>
                  {/* 氏名 */}
                  <TextBox
                    label="氏名"
                    value={name}
                    onChange={setName}
                    placeholder="山田 太朗"
                    required={true}
                  />

                  {/* 社員コード */}
                  <TextBox
                    label="社員コード"
                    value={employeeCode}
                    onChange={setEmployeeCode}
                    placeholder="社員コードを入力"
                    required={true}
                  />

                  {/* 拠点支部（東京: 0, 大阪: 1） */}
                  <div>
                    <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block", fontSize: "14px" }}>拠点支部</label>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="radio"
                          name="department"
                          value="0"
                          checked={department === "0"}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                        東京
                      </label>
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="radio"
                          name="department"
                          value="1"
                          checked={department === "1"}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                        大阪
                      </label>
                    </div>
                  </div>

                  {/* 管理者区分 */}
                  <div>
                    <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block", fontSize: "14px" }}>管理者区分</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="radio"
                          name="role"
                          value="0"
                          checked={role === "0"}
                          onChange={(e) => setRole(e.target.value)}
                        />
                        一般ユーザー
                      </label>
                      {/* 貸出ユーザーと管理者は選択不可にするため削除 */}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px", fontSize: "13px", color: "#777" }}>
                  ※パスワードリセットモードでは、氏名・社員コード・拠点支部・管理者区分は変更できません。
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
              >
                {operation === "create" ? "登録する" : "パスワードをリセットする"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/UsersList")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1976d2",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ユーザー一覧画面へ戻る
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UserManagement;