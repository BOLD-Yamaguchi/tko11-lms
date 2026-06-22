import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import type { HamburgerMenuItem } from "./components/HamburgerMenu";
import { TextBox } from "./components/TextBox";
import "./UserEdit.css";

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
          const result = await response.json();
          alert(result.message);
          setIsModalOpen(false);
          return;
        }
        throw new Error("更新に失敗しました");
      }

      alert("ユーザー情報を更新しました");
      setIsModalOpen(false);
      navigate("/UsersList");
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
      navigate("/UsersList");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="user-edit-container">
      <Header
        title="書籍貸出管理システム"
        eyebrow="BOOK MANAGEMENT SYSTEM"
        menuItems={menuItems}
        onMenuSelect={handleMenuSelect}
      />

      <main className="user-edit-main">
        <div className="user-edit-card">
          <h2 className="user-edit-title">ユーザー情報編集</h2>

          <form onSubmit={handleOpenModal}>
            <div className="form-flex-container">

              {/* 社員コード（非活性・閲覧のみ） */}
              <div>
                <label className="form-label">社員コード</label>
                <input
                  type="text"
                  value={employeeCode || ""}
                  disabled={true}
                  className="disabled-input"
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
                <label className="form-label">拠点支部</label>
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
                <label className="form-label">管理者区分</label>
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
            </div>

            <div className="action-container">
              <div>
                {sessionStorage.getItem("employeeCode") !== employeeCode && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isSubmitting}
                    className="btn delete-button"
                  >
                    削除
                  </button>
                )}
              </div>

              {/* 戻る・更新ボタンのグループ */}
              <div className="right-buttons">
                <button
                  type="button"
                  onClick={() => navigate("/UsersList")}
                  className="btn user-edit-back-button"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  className="btn submit-button"
                >
                  更新
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>変更内容の確認</h3>
            <p className="modal-description">以下の内容でユーザー情報を更新しますか？</p>
            <div className="modal-data-list">
              <div><strong>社員コード:</strong> {employeeCode}</div>
              <div><strong>メールアドレス:</strong> {email}</div>
              <div><strong>氏名:</strong> {name}</div>
              <div><strong>拠点支部:</strong> {department === "1" ? "大阪" : "東京"}</div>
              <div><strong>管理者区分:</strong> {role === "2" ? "管理者" : role === "1" ? "貸出ユーザー" : "一般ユーザー"}</div>
            </div>
            <div className="modal-buttons">
              <button type="button" disabled={isSubmitting} onClick={() => setIsModalOpen(false)} className="modal-btn modal-btn-cancel">
                キャンセル
              </button>
              <button type="button" disabled={isSubmitting} onClick={handleUpdate} className="modal-btn submit-button">
                {isSubmitting ? "更新中..." : "確定"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="delete-title">ユーザー削除の確認</h3>
            <p className="modal-description">
              以下のユーザーを<strong>完全に削除</strong>しますか？<br />
              この操作は取り消せません。
            </p>
            <div className="modal-data-list delete-data-box">
              <div><strong>社員コード:</strong> {employeeCode}</div>
              <div><strong>氏名:</strong> {name}</div>
            </div>
            <div className="modal-buttons">
              <button type="button" disabled={isSubmitting} onClick={() => setIsDeleteModalOpen(false)} className="modal-btn modal-btn-cancel">
                キャンセル
              </button>
              <button type="button" disabled={isSubmitting} onClick={handleDelete} className="modal-btn delete-button">
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