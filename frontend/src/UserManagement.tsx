import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import type { HamburgerMenuItem } from "./components/HamburgerMenu";
import { TextBox } from "./components/TextBox";
import "./UserManagement.css";

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
        adminKbn: Number(role),
      };

      console.log("新規登録実行:", payload);
      try {
        const response = await fetch("http://localhost:8080/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          if (response.status === 409) {
            const result = await response.json();
            alert(result.message);
            return;
          }
          throw new Error("登録に失敗しました");
        }

        alert("ユーザーを新規登録しました。");
      } catch (error) {
        console.error(error);
        alert("サーバーとの通信に失敗しました");
        return;
      }
    } else {
      // パスワードリセットのAPIリクエスト
      const payload = {
        mailAddress: email,
        password: password,
      };

      console.log("パスワードリセット実行:", payload);
      try {
        const response = await fetch(`http://localhost:8080/users/password-reset`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("パスワードリセットに失敗しました");
        }
        alert("パスワードをリセットしました");
      } catch (error) {
        console.error(error);
        alert("サーバーとの通信に失敗しました");
        return;
      }
    }

    navigate("/UsersList");
  };

  return (
    <div className="user-mgmt-container">
      <Header
        title="書籍貸出管理システム"
        eyebrow="BOOK MANAGEMENT SYSTEM"
        menuItems={menuItems}
        onMenuSelect={handleMenuSelect}
      />

      <main className="user-mgmt-main">
        <div className="user-mgmt-card">
          <h2 className="user-mgmt-title">ユーザー管理画面</h2>

          <form onSubmit={handleSubmit}>
            {/* 操作選択 */}
            <div className="operation-select-container">
              <label className="form-label-bold">操作選択</label>
              <div className="radio-group-row">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="operation"
                    value="create"
                    checked={operation === "create"}
                    onChange={() => setOperation("create")}
                  />
                  新規ユーザー登録
                </label>
                <label className="radio-label">
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

            <hr className="form-divider" />

            <div className="form-flex-container">
              <h3 className="area-subtitle">ユーザー情報入力エリア</h3>

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
                    <label className="form-label-small">拠点支部</label>
                    <div className="radio-group-row">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="department"
                          value="0"
                          checked={department === "0"}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                        東京
                      </label>
                      <label className="radio-label">
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
                    <label className="form-label-small">管理者区分</label>
                    <div className="radio-group-col">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="role"
                          value="0"
                          checked={role === "0"}
                          onChange={(e) => setRole(e.target.value)}
                        />
                        一般ユーザー
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="role"
                          value="1"
                          checked={role === "1"}
                          onChange={(e) => setRole(e.target.value)}
                        />
                        貸出ユーザー
                      </label>
                      <label className="radio-label">
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
                <div className="reset-mode-notice">
                  ※パスワードリセットモードでは、氏名・社員コード・拠点支部・管理者区分は変更できません。
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div className="action-container-col">
              <button
                type="submit"
                className="submit-button-full"
              >
                {operation === "create" ? "登録" : "リセット"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/UsersList")}
                className="user-management-back-button"
              >
                戻る
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UserManagement;