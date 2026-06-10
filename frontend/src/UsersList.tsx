import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
  employee_code: string;
  role: number;
  department: number;
};

function UsersList() {
  const navigate = useNavigate();

  // APIから取得した全ユーザー
  const [users, setUsers] = useState<User[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // 画面表示用ユーザー
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // 検索条件
  const [searchField, setSearchField] = useState("メールアドレス");

  const [searchValue, setSearchValue] = useState("");

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
            matchesKeyword = user.email
              .toLowerCase()
              .includes(query);
            break;

          case "氏名":
            matchesKeyword = user.name.includes(
              searchValue.trim()
            );
            break;

          case "社員コード":
            matchesKeyword = user.employee_code
              .toLowerCase()
              .includes(query);
            break;
        }
      }

      const matchesDepartment =
        department === "" ||
        String(user.department) === department;

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

  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E8E8E8",
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          backgroundColor: "#2C5A9C",
          color: "white",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>書籍貸出管理システム</h1>
        <span>ようこそ</span>
      </header>

      {/* 検索エリア */}
      <div
        style={{
          backgroundColor: "white",
          margin: "20px",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <h1 style={{marginBottom: "15px",fontSize: "20px", color: "black",textAlign: "left"}}>社員検索</h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <select
            value={searchField}
            onChange={(e) =>
              setSearchField(e.target.value)
            }
            style={{
              border: "1px solid black",
              padding: "5px",
              paddingRight: "50px",
              backgroundColor: "white",
              color: "black",
            }}
          >
            <option>メールアドレス</option>
            <option>氏名</option>
            <option>社員コード</option>
          </select>

          <input
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
            style={{
              border: "1px solid black",
              marginLeft: "10px",
              padding: "5px",
              flex: 1,
              backgroundColor: "white",
              color: "black",
            }}
          />
          <select
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            style={{
              border: "1px solid black",
              padding: "5px",
              backgroundColor: "white",
              color: "black",
            }}
          >
            <option value="">全拠点</option>
            <option value="0">東京</option>
            <option value="1">大阪</option>
          </select>

          <button
            onClick={handleSearch}
            style={{
              padding: "5px 15px",
              whiteSpace: "nowrap",
            }}
          >
            検索
          </button>
        </div>

        {/* 一覧 */}
        <div
          style={{
            backgroundColor: "white",
            marginTop: "30px",
          }}
        >
          <h1
            style={{
              paddingBottom: "20px",
              fontSize: "20px",color: "black",textAlign: "left",
            }}
          >
            検索結果
            <strong>{filteredUsers.length}</strong> 件
          </h1>

          <table
            border={1}
            width="100%"
            style={{
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead
              style={{
                backgroundColor: "#bce0ea",
                borderBottom:
                  "2px solid #2C5A9C",
                height: "60px",
              }}
            >
              <tr>
                <th>ID</th>

                <th
                  onClick={() =>
                    handleSort("name")
                  }
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  名前
                  {sortField === "name" &&
                    (sortOrder === "asc"
                      ? " ▲"
                      : " ▼")}
                </th>

                <th>メールアドレス</th>

                <th
                  onClick={() =>
                    handleSort(
                      "employee_code"
                    )
                  }
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  社員コード
                  {sortField ===
                    "employee_code" &&
                    (sortOrder === "asc"
                      ? " ▲"
                      : " ▼")}
                </th>

                <th>権限</th>

                <th>所属場所</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom:
                      "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    (window.location.href = `/users/${user.id}`)
                  }
                >
                  <td style={{ padding: "15px" }}>
                    {user.id}
                  </td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    {user.employee_code}
                  </td>

                  <td>
                    {user.role === 1 ? "管理者" : "一般社員"}
                  </td>

                  <td>
                    {user.department === 1 ? "大阪": "東京"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}>
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          paddingRight: "30px",
        }}>
        <button
          onClick={() => navigate("/users/create")}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#2C5A9C",
            color: "white",
            fontSize: "32px",
            cursor: "pointer",
          }}>
          ＋
        </button>
      </div>
    </div>
  );
}

export default UsersList;