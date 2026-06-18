import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "./api/usersApi";
import "./UsersList.css";
import Header from "./components/Header";
import type { HamburgerMenuItem } from "./components/HamburgerMenu";
import type { User } from "./schemas/userSchema";

const EMPTY_USERS: User[] = [];

function UsersList() {
  const navigate = useNavigate();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  useEffect(() => {
    console.log("APIレスポンス:", usersQuery.data);
  }, [usersQuery.data]);


  const users = usersQuery.data ?? EMPTY_USERS;

  const [currentPage, setCurrentPage] = useState(1);
  // 1ページあたりの表示件数
  const itemsPerPage = 5;

  const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
  const displayedUsers = filteredUsers ?? users;

  const [searchField, setSearchField] = useState("メールアドレス");
  const [searchValue, setSearchValue] = useState("");
  const [department, setDepartment] = useState("");

  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 🔍 検索
  const handleSearch = () => {
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

      const matchesDepartment =
        department === "" ||
        String(user.affiliationKbn) === department;

      return matchesKeyword && matchesDepartment;
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  };

  // 🔽 ソート
  const handleSort = (field: keyof User) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";

    const sortedUsers = [...displayedUsers].sort((a, b) => {
      const valueA = a[field] ?? "";
      const valueB = b[field] ?? "";

      if (newOrder === "asc") {
        return String(valueA).localeCompare(String(valueB), "ja");
      }
      return String(valueB).localeCompare(String(valueA), "ja");
    });

    setFilteredUsers(sortedUsers);
    setSortField(field);
    setSortOrder(newOrder);
  };

  const totalPages = Math.ceil(displayedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = displayedUsers.slice(startIndex, startIndex + itemsPerPage);

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

  return (
    <div className="users-list">
      <Header
        title="書籍貸出管理システム"
        eyebrow="BOOK MANAGEMENT SYSTEM"
        menuItems={menuItems}
        onMenuSelect={handleMenuSelect}
      />

      <div className="search-container">
        <h1 className="section-title">社員検索</h1>

        <div className="search-form">
          <select
            className="search-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option>メールアドレス</option>
            <option>氏名</option>
            <option>社員コード</option>
          </select>

          <input
            className="search-input"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={`${searchField}を入力`}
          />

          <select
            className="search-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">全拠点</option>
            <option value="0">東京</option>
            <option value="1">大阪</option>
          </select>

          <button className="search-button" onClick={handleSearch}>
            検索
          </button>
        </div>

        <div className="results-container">
          <h1 className="result-title">
            検索結果 <strong>{displayedUsers.length}</strong> 件
          </h1>

          <table border={1} className="user-table">
            <thead>
              <tr>
                <th>No.</th>

                <th
                  className="sortable-header"
                  onClick={() => handleSort("username")}
                >
                  名前
                  {sortField === "username" &&
                    (sortOrder === "asc" ? " ▲" : " ▼")}
                </th>

                <th>メールアドレス</th>

                <th
                  className="sortable-header"
                  onClick={() => handleSort("employeeCode")}
                >
                  社員コード
                  {sortField === "employeeCode" &&
                    (sortOrder === "asc" ? " ▲" : " ▼")}
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
              className="page-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              前へ
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-button ${page === currentPage ? "active" : ""}`}
              >
                {page}
              </button>
            ))}

            <button
              className="page-button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              次へ
            </button>
          </div>
        </div>
      </div>

      <div className="create-button-container">
        <button className="create-button" onClick={() => navigate("/user-create")}>
          ＋
        </button>
      </div>
    </div>
  );
}

export default UsersList;
