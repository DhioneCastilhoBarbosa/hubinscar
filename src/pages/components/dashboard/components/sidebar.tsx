import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  HardHat,
  Headset,
  MessageCircle,
  // MessageCircle,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import ImgAvatar from "../../../../assets/avatar.jpeg";

interface SidebarProps {
  onSelectMenuItem: (item: string) => void;
}

export default function Sidebar({ onSelectMenuItem }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });

  const person = localStorage.getItem("person");

  const menuItems = [
    { icon: <FileText className="w-5 h-5" />, label: "Meus orçamentos" },
    ...(person === "cliente"
      ? [{ icon: <HardHat className="w-5 h-5" />, label: "Instaladores" }]
      : []),
    ...(person !== "cliente"
      ? [{ icon: <DollarSign className="w-5 h-5" />, label: "Financeiro" }]
      : []),
    { icon: <MessageCircle className="w-5 h-5" />, label: "Chat" },
    { icon: <User className="w-5 h-5" />, label: "Minha conta" },
    { icon: <Headset className="w-5 h-5" />, label: "Suporte" },
  ];

  useEffect(() => {
    //console.log("useEffect montado: escutando evento photoUpdated");

    const updatePhoto = () => {
      //console.log("Evento photoUpdated disparado");
      const name = (localStorage.getItem("name") || "").trim();
      const company = (localStorage.getItem("company") || "").trim();
      const photo = (localStorage.getItem("photo") || "").trim();

      const displayName = name || company || "Usuário";
      if (displayName) {
        setUser({ name: displayName, avatar: photo });
      }
    };

    window.addEventListener("photoUpdated", updatePhoto);

    // Carrega dados inicialmente
    updatePhoto();

    return () => {
      window.removeEventListener("photoUpdated", updatePhoto);
    };
  }, []);

  return (
    <div
      className={`h-full bg-gray-800/30 text-white transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      } flex flex-col justify-between`}
    >
      {/* Topo com botão */}
      <div>
        <div className="flex items-center justify-between p-4">
          {isOpen && <span className="text-lg font-bold"></span>}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <nav>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-700 cursor-pointer"
              title={!isOpen ? item.label : undefined}
              onClick={() => onSelectMenuItem(item.label)} // Chama a função ao clicar
            >
              {item.icon}
              {isOpen && <span className="text-sm">{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>

      {/* Rodapé com o usuário */}
      <div className="p-4 border-t border-gray-700 flex items-center gap-3">
        <img
          src={user.avatar ? user.avatar : ImgAvatar}
          alt="Avatar"
          className={`rounded-full object-cover transition-all duration-300 ${
            isOpen ? "w-10 h-10" : "w-8 h-8 mx-auto"
          }`}
        />
        {isOpen && <span className="text-sm">{user.name}</span>}
      </div>
    </div>
  );
}
