// Dashboard.tsx
import { useState } from "react";
import Sidebar from "./components/sidebar";
import UserProfile from "./components/userProfile";
import Services from "./components/services";
import Chats from "./components/chat/chats";

export default function Dashboard() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Meus Serviços")

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "Minha Conta":
        return <UserProfile />;
      case "Meus Serviços":
        return <Services/>;
      case "Chat":
        return <Chats/>;
      default:
        return <UserProfile />;
    }
  }
  return (
    <div className="flex h-full w-full">
      <Sidebar onSelectMenuItem={setSelectedMenuItem}/>
      <main className="flex-1 h-full flex items-start lg:items-start justify-center overflow-auto bg-zinc-800/70 text-black lg:p-6 p-1 pb-[env(safe-area-inset-bottom)]">
        {renderContent()}
      </main>
    </div>
  );
}
