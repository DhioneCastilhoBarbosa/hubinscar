// Dashboard.tsx
import { useState } from "react";
import Sidebar from "./components/sidebar";
import UserProfile from "./components/userProfile";
import Services from "./components/services";
//import Chats from "./components/chat/chats";
import EmConstrucao from "./components/EmConstrucao";
import Installer from "./components/installer/installer"
import Financeiro from "./components/financeiro/financeiro";
import Support from "./components/support/supportPage";
import Chats from "./components/chat/chats";

export default function Dashboard() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Meus orçamentos");

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "Minha conta":
        return <UserProfile />;
      case "Meus orçamentos":
        return <Services/>;
      case "Chat":
        return <Chats/>;
      case "Instaladores":
        return <Installer/>
      case "Financeiro":
        return <Financeiro />;
      case "Suporte":
        return <Support />;
      default:
        return <EmConstrucao />;
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
