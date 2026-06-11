import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "./components/Header";
import type { HamburgerMenuItem } from "./components/HamburgerMenu";

import { MenuCard } from "./components/MenuCard";
import { LogoutModal } from "./components/LogoutModal";
import { Button } from "./components/ui/button";

import { BookOpen, Users } from "lucide-react";

export default function HomePage() {
const navigate = useNavigate();
const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
id: "users",
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
case "users":
navigate("/users");
break;
}
};

const handleLogout = () => {
console.log("ログアウトしました");
setIsLogoutModalOpen(false);

return ( <div className="min-h-screen flex flex-col bg-gray-100"> <Header
     title="社内書籍貸出管理システム"
     eyebrow="BOOK MANAGEMENT SYSTEM"
     menuItems={menuItems}
     onMenuSelect={handleMenuSelect}
   />

```
  <main className="flex-1 container mx-auto px-4 py-8 mt-24">
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MenuCard
          icon={<BookOpen className="w-12 h-12" />}
          title="書籍管理"
          description="書籍の検索・登録・削除"
          onClick={() => navigate("/books")}
        />

        <MenuCard
          icon={<Users className="w-12 h-12" />}
          title="ユーザー管理"
          description="ユーザーの登録・編集"
          onClick={() => navigate("/users")}
        />
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setIsLogoutModalOpen(true)}
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
}
