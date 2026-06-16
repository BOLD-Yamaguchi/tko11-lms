import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UsersList.css";
import Header from "./components/Header";

// Userオブジェクトの型を定義
type User = {
  userId: string;       
  username: string;     
  mailAddress: string;  
  employeeCode: string; 
  adminKbn: number; 
  affiliationKbn: number; 
};

function UsersList() {
  const navigate = useNavigate();

  // APIから取得した全ユーザー
  const [users, setUsers] = useState<User[]>([]);

  // 現在表示中のページ番号
  const [currentPage, setCurrentPage] = useState(1);
  // 1ページあたりの表示件数
  const itemsPerPage = 5;

  // 画面表示用ユーザー
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // 検索条件
  const [searchField, setSearchField] = useState("メールアドレス");
  // 入力値
  const [searchValue, setSearchValue] = useState("");
  // 所属拠点
  const [department, setDepartment] = useState("");

  // ソート情報
  const [sortField, setSortField] = useState<keyof User | null>(null);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 初回表示時
  useEffect(() => {
    fetchUsers();
  }, []);

  // ユーザー一覧取得
  const fetchUsers = async (): Promise<void> => {
    const response = await fetch(
      "http://localhost:8080/users"
    );

    const data: User[] = await response.json();

    setUsers(data);
    setFilteredUsers(data);
  };

  // 検索
  const handleSearch = (): void => {
    const query = searchValue.trim().toLowerCase();

    const result = users.filter((user) => {
      let matchesKeyword = true;

      if (query) {
        switch (searchField) {
          case "メールアドレス":
            matchesKeyword = user.mailAddress.toLowerCase().includes(query);
            break;

          case "氏名":
            matchesKeyword = user.username.includes(searchValue.trim());
            break;

          case "社員コード":
            matchesKeyword = user.employeeCode.toLowerCase().includes(query);
            break;
        }
      }
      // 所属拠点の絞り込み
      const matchesDepartment =
        department === "" ||
        String(user.affiliationKbn) === department;

      return (
        matchesKeyword &&
        matchesDepartment
      );
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  };

  // ソート
  const handleSort = (
    field: keyof User
  ): void => {
    const newOrder =
      sortField === field &&
      sortOrder === "asc"
        ? "desc"
        : "asc";

    const sortedUsers = [...filteredUsers].sort(
      (a, b) => {
        const valueA = a[field] ?? "";
        const valueB = b[field] ?? "";

        if (newOrder === "asc") {
          return String(valueA).localeCompare(
            String(valueB),
            "ja"
          );
        }

        return String(valueB).localeCompare(
          String(valueA),
          "ja"
        );
      }
    );

    setFilteredUsers(sortedUsers);
    setSortField(field);
    setSortOrder(newOrder);
  };

  // 総ページ数
  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );
  // 開始位置
  const startIndex =
    (currentPage - 1) * itemsPerPage;
  // 現在のページに表示するユーザー
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="users-list">
      {/* ヘッダー */}
      <Header
        title="書籍貸出管理システム"
        menuItems={[]}
      />

      {/* 検索エリア */}
      <div className="search-container">
        <h1 className="section-title">社員検索</h1>

        <div className="search-form">
          <select className="search-select"
            value={searchField}
            onChange={(e) =>
              setSearchField(e.target.value)
            }>
            <option>メールアドレス</option>
            <option>氏名</option>
            <option>社員コード</option>
          </select>

          <input
            className="search-input"
            type="text"
            value={searchValue}
            onChange={(e) =>
              setSearchValue(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder={`${searchField}を入力`}
          />
          <select
            className="search-select"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
>
            <option value="">全拠点</option>
            <option value="0">東京</option>
            <option value="1">大阪</option>
          </select>

          <button className="search-button"
            onClick={handleSearch}>
            検索
          </button>
        </div>

        {/* 一覧 */}
        <div className="results-container">
          <h1 className="result-title">
            検索結果
            <strong>{filteredUsers.length}</strong> 件
          </h1>

          <table
            border={1}
            className="user-table">
            <thead className="user-table thead">
              <tr>
                <th>No.</th>

                <th className="sortable-header"
                  onClick={() =>
                    handleSort("username")
                  }>
                  名前
                  {sortField === "username" &&
                    (sortOrder === "asc"
                      ? " ▲"
                      : " ▼")}
                </th>

                <th>メールアドレス</th>

                <th className="sortable-header"
                  onClick={() =>
                    handleSort(
                      "employeeCode"
                    )
                  }>
                  社員コード
                  {sortField ===
                    "employeeCode" &&
                    (sortOrder === "asc"
                      ? " ▲"
                      : " ▼")}
                </th>

                <th>権限</th>

                <th>所属場所</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user, index) => {
                const getAdminLabel = (kbn: number) => {
                  if (kbn === 0) return "一般ユーザー";
                  if (kbn === 1) return "貸出ユーザー";
                  if (kbn === 2) return "管理者";
                  return "未設定";
                };

                return (
                  <tr className="user-row "
                    key={user.userId}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "#f0f8ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "white")
                    }
                    onClick={() => navigate(`/users/${user.employeeCode}`)}
                  >
                    <td style={{ padding: "15px" }}>{startIndex + index + 1}</td>

                    <td>{user.username}</td>

                    <td>{user.mailAddress}</td>

                    <td>{user.employeeCode}</td>

                    <td>{getAdminLabel(user.adminKbn)}</td>

                    <td>{user.affiliationKbn === 1 ? "大阪" : "東京"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }>
              前へ
            </button>

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                style={{
                  padding: "5px 10px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor:
                    page === currentPage
                      ? "#2C5A9C"
                      : "white",
                  color:
                    page === currentPage
                      ? "white"
                      : "black",
                }}
              >
                {page}
              </button>
            ))}

            <button
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
            >
              次へ
            </button>
          </div>
        </div>
      </div>
      <div className="create-button-container ">
        <button className="create-button"
          onClick={() => navigate("/users/create")}>
          ＋
        </button>
      </div>
    </div>
  );
}

export default UsersList;