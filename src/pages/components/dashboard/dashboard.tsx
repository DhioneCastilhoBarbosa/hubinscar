// Dashboard.tsx
import { useState } from "react";
import Sidebar from "./components/sidebar";
import UserProfile from "./components/userProfile";

export default function Dashboard() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Minha Conta")

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "Minha Conta":
        return <UserProfile />;
      case "Meus Serviços":
        return <div>Meus serviços</div>;
      case "Chat":
        return <div>Chat</div>;
      default:
        return <UserProfile />;
    }
  }
  return (
    <div className="flex h-full w-full">
      <Sidebar onSelectMenuItem={setSelectedMenuItem}/>
      <main className="flex-1 h-full flex items-start lg:items-center justify-center overflow-auto bg-gray-200 text-black lg:p-6 p-1 ">
        {renderContent()}
      </main>
    </div>
  );
}
