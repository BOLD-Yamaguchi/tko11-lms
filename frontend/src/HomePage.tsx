import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "./components/Header";
import type { HamburgerMenuItem } from "./components/HamburgerMenu";

import { MenuCard } from "./components/MenuCard";
import { ModalDialog } from "./components/ModalDialog";
import { BookOpen, Users } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [isModalDialogOpen, setIsModalDialogOpen] = useState(false);

  // ホバー状態を管理するステート
  const [isHoveredBooks, setIsHoveredBooks] = useState(false);
  const [isHoveredUsers, setIsHoveredUsers] = useState(false);

  const menuItems: HamburgerMenuItem[] = [
    {
      id: "home",
      label: "ホーム",
      description: "トップ画面へ移動",
    },
    {
      id: "books",
      label: "書籍管理",
      description: "書籍一覧を表示",
    },
    {
      id: "UsersList",
      label: "ユーザー管理",
      description: "ユーザー管理画面を表示",
    },
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

  const handleLogout = () => {
    console.log("ログアウトしました");
    setIsModalDialogOpen(false);
  };

  // メニューカード共通のベーススタイル
  const cardWrapperStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
    width: "100%",
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#f3f4f6"
    }}>
      {/* ヘッダーエリア */}
      <Header
        title="書籍貸出管理システム"
        eyebrow="BOOK MANAGEMENT SYSTEM"
        menuItems={menuItems}
        onMenuSelect={handleMenuSelect}
      />

      {/* メインコンテンツエリア：ヘッダー以外の高さをフルに使い中央寄せ */}
      <main style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          width: "100%",
          maxWidth: "800px"
        }}>

          {/* メニューグリッド：2カラムレイアウト */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
            width: "100%"
          }}>

            {/* 書籍管理カードのコンテナ */}
            <div
              onMouseEnter={() => setIsHoveredBooks(true)}
              onMouseLeave={() => setIsHoveredBooks(false)}
              style={{
                ...cardWrapperStyle,
                transform: isHoveredBooks ? "translateY(-5px)" : "translateY(0)",
                boxShadow: isHoveredBooks 
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                  : cardWrapperStyle.boxShadow
              }}
            >
            
              <MenuCard
                icon={BookOpen}
                title="書籍管理"
                description="書籍の検索・登録・削除"
                onClick={() => navigate("/books")}
              />
            </div>

            {/* ユーザー管理カードのコンテナ */}
            <div
              onMouseEnter={() => setIsHoveredUsers(true)}
              onMouseLeave={() => setIsHoveredUsers(false)}
              style={{
                ...cardWrapperStyle,
                transform: isHoveredUsers ? "translateY(-5px)" : "translateY(0)",
                boxShadow: isHoveredUsers 
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                  : cardWrapperStyle.boxShadow
              }}
            >
              <MenuCard
                icon={Users}
                title="ユーザー管理"
                description="ユーザーの登録・編集"
                onClick={() => navigate("/UsersList")}
              />
            </div>

          </div>

        </div>
      </main>

      {/* ログアウトモーダル */}
      <ModalDialog
        open={isModalDialogOpen}
        title="ログアウト"
        description="本当にログアウトしますか？"
        confirmLabel="ログアウト"
        cancelLabel="キャンセル"
        tone="danger"
        onClose={() => setIsModalDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}