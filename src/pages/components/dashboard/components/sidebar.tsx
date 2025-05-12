import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../../services/api";

interface SidebarProps {
  onSelectMenuItem: (item: string) => void;
}


export default function Sidebar({onSelectMenuItem}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    
  });

  const menuItems = [
    
    { icon: <Settings className="w-5 h-5" />, label: "Meus Serviços" },
    { icon: <MessageCircle className="w-5 h-5" />, label: "Chat" },
    { icon: <User className="w-5 h-5" />, label: "Minha Conta" },
  ];

  

  useEffect(() => {
    const ID = localStorage.getItem("ID")
    if (!ID) return

    const fetchUser = async () => {
      try {
        const response = await api.get(`/user/list?id=${ID}`)
        const data = response.data[0] // supondo que a API retorna um array com 1 item
        setUser({
          name: data.username,
         
          avatar: `https://api-user-service.eletrihub.com/${data.photo}`, // ou use data.avatar se tiver
        })
       
      } catch (err) {
        console.error("Erro ao buscar dados do usuário", err)
      }
    }

    fetchUser()
  }, [])

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
          src={user.avatar}
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
