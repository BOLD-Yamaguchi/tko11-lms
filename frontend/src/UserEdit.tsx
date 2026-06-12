import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import { TextBox } from "./components/TextBox";

function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // 新規登録時は URL パラメータによって "create" などが入る想定

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

  // パスワードが一致していないかどうかの判定
  const isPasswordMismatch = password !== "" && confirmPassword !== "" && password !== confirmPassword;

  // サブミット時の処理
  const handleSubmit = async (e: React.FormEvent) => {
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

      // 新規登録のAPIリクエストを想定
      const payload = {
        email,
        password,
        name,
        employee_code: employeeCode,
        department: Number(department),
        role: Number(role),
        // UUID, 登録日、更新日はサーバーサイドで自動設定される想定
      };

      console.log("新規登録実行:", payload);
      // await fetch("http://localhost:8080/users", { method: "POST", body: JSON.stringify(payload), ... })
      alert("ユーザーを新規登録しました。");
    } else {
      // パスワードリセットのAPIリクエストを想定
      const payload = {
        email,
        new_password: password,
      };

      console.log("パスワードリセット実行:", payload);
      // await fetch(`http://localhost:8080/users/password-reset`, { method: "PUT", body: JSON.stringify(payload), ... })
      alert("パスワードをリセットしました。");
    }

    // 完了後、ユーザー一覧画面へ戻る
    navigate("/users");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      {/* ヘッダーの配置 */}
      <Header title="書籍貸出管理システム" menuItems={[]} />

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

              {/* ユーザーID (メールアドレス) - 常に必須 */}
              <TextBox
                label="ユーザーID（メールアドレス）"
                value={email}
                onChange={setEmail}
                placeholder="user@example.com"
                required={true}
              />

              {/* パスワード / 新パスワード - 常に必須 */}
              <TextBox
                label={operation === "create" ? "パスワード" : "新パスワード"}
                value={password}
                onChange={setPassword}
                placeholder="パスワードを入力"
                required={true}
              />

              {/* パスワード再入力 - 常に必須 */}
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
                    placeholder="山田 太朗"
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

                  {/* 管理者区分（一般ユーザー: 0, 貸出ユーザー: 1, 管理者: 2） */}
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
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="radio"
                          name="role"
                          value="1"
                          checked={role === "1"}
                          onChange={(e) => setRole(e.target.value)}
                        />
                        貸出ユーザー
                      </label>
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="radio"
                          name="role"
                          value="2"
                          checked={role === "2"}
                          onChange={(e) => setRole(e.target.value)}
                        />
                        管理者
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                /* パスワードリセット時は氏名、社員コード、拠点、管理者区分を非表示（または非活性）にする要件に基づき、ここでは非表示に制御しています */
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

              {/* ユーザー一覧画面へ戻るリンク */}
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

export default UserEdit;