import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { MenuCard } from "./components/MenuCard";
import { LogoutModal } from "./components/LogoutModal";
import { BookOpen, Users } from "lucide-react";
import { Button } from "./components/ui/button";

export default function HomePage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // ログアウト処理をここに実装
    console.log("ログアウトしました");
    setIsLogoutModalOpen(false);
    // 実際のアプリではログイン画面にリダイレクトなど
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MenuCard
              icon={<BookOpen className="w-12 h-12" />}
              title="書籍管理"
              description="書籍の検索ができます"
              onClick={() => navigate("/books")}
            />
            <MenuCard
              icon={<Users className="w-12 h-12" />}
              title="ユーザー管理"
              description="ユーザーの登録・編集ができます"
              onClick={() => navigate("/users")}
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(true)}
              className="bg-white hover:bg-gray-50 border-gray-300"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </main>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
