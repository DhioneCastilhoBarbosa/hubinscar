import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-scroll";

import {useNavigate} from "react-router-dom";

interface HeaderProps {
  menuType?: "home" | "full";
  buttonVisible?: boolean;
  menuVisible?: boolean;
}

export default function Header({menuType, buttonVisible, menuVisible}:HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/signin");
  }

  function handleGoToHome() {
    navigate("/");
  }

  const menuItems = [
    { name: "Inicio", to: "home" },
    { name: "Sobre", to: "about" },
    { name: "Serviços", to: "service" },
    { name: "Instalador", to: "installer" },
    { name: "Contato", to: "contact" },
  ];

  // Filtra os itens do menu com base na prop menuType
  const filteredMenu = menuType === "full" && menuItems;

  return (
    <div className="flex flex-row items-center justify-between bg-black h-16 md:pr-6 pl-6 w-screen fixed top-0 z-20">
      {/* Logo e Menu em telas maiores */}
      <div className="flex items-center gap-16">
        <div 
          className="font-bold text-2xl text-white md:ml-4 cursor-pointer"
          onClick={handleGoToHome}>
          LOGO
        </div>
        <ul className="hidden md:flex md:flex-row md:gap-8 font-light text-white">
          {filteredMenu && filteredMenu.map((item) => (
            <li key={item.to} className="hover:text-gray-400 cursor-pointer">
              <Link to={item.to} smooth={true} duration={1000}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        
      </div>

      {/* Botão de Login e Menu Sanduíche em telas menores */}
      <div className="flex items-center gap-4 h-full">
        {menuVisible && (
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>)}

        {buttonVisible && (
        <button 
          className="bg-white text-black w-24 h-full md:h-8 md:rounded-lg hover:bg-gray-200 hover:cursor-pointer md:mr-4"
          onClick={handleLogin}>
          Login
        </button>
        )}
      </div>
      

      {/* Menu Sanduíche */}
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-gray-300 flex flex-col items-center gap-6 py-6 font-light text-black md:hidden z-10">
          {filteredMenu && filteredMenu.map((item) => (
            <li
              key={item.to}
              className="w-full text-center hover:bg-gray-500 hover:text-white cursor-pointer py-2"
            >
              <Link to={item.to} smooth={true} duration={1000}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
