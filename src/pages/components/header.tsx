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
  function handleContact() {
    navigate("/contato");
  }

  function handleGoToHome() {
    navigate("/");
  }

  const menuItems = [
    { name: "Inicio", to: "home" },
    { name: "Sobre", to: "about" },
    { name: "Serviços", to: "service" },
    { name: "Parceiro", to: "installer" },
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
          {filteredMenu&&
          <li className="hover:text-gray-400 cursor-pointer"
            onClick={handleContact}
          >
            Contato
          </li>}
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
          <ul className="fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-black/90 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center gap-6 py-6 font-light text-white md:hidden z-50 transition-all duration-300">
            {filteredMenu && filteredMenu.map((item) => (
              <li
                key={item.to}
                className="w-full text-center py-3 rounded-md hover:bg-white/10 transition-all duration-200"
              >
                <Link
                  to={item.to}
                  smooth={true}
                  duration={1000}
                  offset={-80} // Ajusta se você tiver um header fixo de 80px
                  onClick={() => {
                    setTimeout(() => setMenuOpen(false), 600); // um pouquinho maior que `duration`
                  }}
                  className="block w-full h-full"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {filteredMenu && (
              <li
                className="w-full text-center py-3 rounded-md hover:bg-white/10 transition-all duration-200"
                onClick={() => {
                  handleContact();
                  setMenuOpen(false);
                }}
              >
                <span className="block w-full h-full cursor-pointer">Contato</span>
              </li>
            )}
          </ul>
        )}



    </div>
  );
}
