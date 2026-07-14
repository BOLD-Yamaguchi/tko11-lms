import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import type { HamburgerMenuItem } from "./components/HamburgerMenu";
import { TextBox } from "./components/TextBox";

type User = {
  userId: string;
  username: string;
  mailAddress: string;
  employeeCode: string;
  adminKbn: number;
  affiliationKbn: number;
};

function UserEdit() {
  const navigate = useNavigate();
  // ★ログインユーザーの権限を取得 (管理者なら 2)
  const myAdminKbn = Number(sessionStorage.getItem("adminKbn"));
  const isNotAdmin = myAdminKbn !== 2; // 管理者以外なら true

  const { employeeCode } = useParams<{ employeeCode: string }>();

  // フォームの入力状態
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("0");
  const [role, setRole] = useState("0");
  const [userId, setUserId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // 初期表示時に該当ユーザーの情報を取得
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/users");
        const users: User[] = await response.json();

        const currentUser = users.find((u) => u.employeeCode === employeeCode);

        if (currentUser) {
          setUserId(currentUser.userId);
          setEmail(currentUser.mailAddress);
          setName(currentUser.username);
          setDepartment(String(currentUser.affiliationKbn));
          setRole(String(currentUser.adminKbn));
        } else {
          alert("該当するユーザーが見つかりませんでした。");
          navigate("/UsersList");
        }
      } catch (error) {
        console.error(error);
        alert("ユーザー情報の取得に失敗しました。");
      }
    };

    if (employeeCode) {
      fetchUserData();
    }
  }, [employeeCode, navigate]);

  // 更新確認ボタン押下時（モーダルを開く）
  const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !name) {
      alert("ユーザーID（メールアドレス）および氏名は必須です。");
      return;
    }
    setIsModalOpen(true);
  };

  // モーダル内での最終更新確定処理
  const handleUpdate = async () => {
    setIsSubmitting(true);

    const payload = {
      userId,
      username: name,
      mailAddress: email,
      employeeCode: employeeCode, 
      affiliationKbn: Number(department),
      adminKbn: Number(role),
    };

    try {
      const response = await fetch(`http://localhost:8080/users/${employeeCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 409) {
          alert("このメールアドレスはすでに使用されています。");
          setIsModalOpen(false);
          return;
        }
        throw new Error("更新に失敗しました");
      }

      alert("ユーザー情報を更新しました。");
      setIsModalOpen(false);

      if (Number(sessionStorage.getItem("adminKbn")) === 2) {
        navigate("/UsersList");
      } else {
        navigate("/Home");
      }

    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました。");
      navigate("/UsersList");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ★最終削除確定処理
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/users/${employeeCode}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      alert("ユーザー情報を削除しました。");
      setIsDeleteModalOpen(false);
      navigate("/UsersList");
    } catch (error) {
      console.error(error);
      alert("削除処理中にエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#333" }}>ユーザー情報編集</h2>

          <form onSubmit={handleOpenModal}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* 社員コード（非活性・閲覧のみ） */}
              <div>
                <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block", fontSize: "14px" }}>
                  社員コード
                </label>
                <input
                  type="text"
                  value={employeeCode || ""}
                  disabled={true}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: "#f5f5f5",
                    color: "#555",
                    cursor: "not-allowed",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* ユーザーID (メールアドレス) */}
              <TextBox
                label="ユーザーID（メールアドレス）"
                value={email}
                onChange={setEmail}
                placeholder="user@example.com"
                required={true}
              />

              {/* 氏名 */}
              <TextBox
                label="氏名"
                value={name}
                onChange={setName}
                placeholder="山田 太朗"
                required={true}
              />

              {/* 拠点支部 */}
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
                      disabled={isNotAdmin} // ★ここに追加！
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
                      disabled={isNotAdmin} // ★ここに追加！
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
                      disabled={isNotAdmin} // ★ここに追加！
                      onChange={(e) => setRole(e.target.value)}
                    />
                    管理者
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* 削除ボタン */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={Number(sessionStorage.getItem("adminKbn")) !== 2} // ★管理者以外は無効化
                style={{
                  padding: "12px 24px",
                  backgroundColor: Number(sessionStorage.getItem("adminKbn")) === 2 ? "#d32f2f" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: Number(sessionStorage.getItem("adminKbn")) === 2 ? "pointer" : "not-allowed",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
              >
                削除
              </button>

              {/* 戻る・更新ボタンのグループ */}
              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  type="button"
                  onClick={() => {
                    // コンソールでセッションを確認（F12キーのコンソールタブに出ます）
                    console.log("セッション確認:", sessionStorage.getItem("adminKbn"));  
                    // 管理者(2)なら一覧へ、それ以外ならホームへ戻る
                    if (Number(sessionStorage.getItem("adminKbn")) === 2) {
                      navigate("/UsersList");
                    } else {
                      navigate("/home");
                    }
                  }}

                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#fff",
                    color: "#333",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  戻る
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
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
                  更新
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>変更内容の確認</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>以下の内容でユーザー情報を更新しますか？</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", marginBottom: "24px" }}>
              <div><strong>社員コード:</strong> {employeeCode}</div>
              <div><strong>メールアドレス:</strong> {email}</div>
              <div><strong>氏名:</strong> {name}</div>
              <div><strong>拠点支部:</strong> {department === "1" ? "大阪" : "東京"}</div>
              <div><strong>管理者区分:</strong> {role === "2" ? "管理者" : role === "1" ? "貸出ユーザー" : "一般ユーザー"}</div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" disabled={isSubmitting} onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: "10px", backgroundColor: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}>
                キャンセル
              </button>
              <button type="button" disabled={isSubmitting} onClick={handleUpdate} style={{ flex: 1, padding: "10px", backgroundColor: "#1976d2", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                {isSubmitting ? "更新中..." : "確定"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#d32f2f" }}>ユーザー削除の確認</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
              以下のユーザーを<strong>完全に削除</strong>しますか？<br></br>
              この操作は取り消せません。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", marginBottom: "24px", backgroundColor: "#fff5f5", padding: "12px", borderRadius: "4px", border: "1px solid #ffe3e3" }}>
              <div><strong>社員コード:</strong> {employeeCode}</div>
              <div><strong>氏名:</strong> {name}</div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" disabled={isSubmitting} onClick={() => setIsDeleteModalOpen(false)} style={{ flex: 1, padding: "10px", backgroundColor: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}>
                キャンセル
              </button>
              <button type="button" disabled={isSubmitting} onClick={handleDelete} style={{ flex: 1, padding: "10px", backgroundColor: "#d32f2f", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                {isSubmitting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserEdit;