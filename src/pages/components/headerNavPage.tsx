import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImgLogo from "../../assets/LOGO BRANCA.png"

interface HeaderProps {
  menuType?: "home" | "full";
  buttonVisible?: boolean;
  menuVisible?: boolean;
}

export default function HeaderNavPages({
  menuType,
  buttonVisible,
  menuVisible,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleLogin() {
    navigate("/signin");
  }

  function handleGoToHome() {
    navigate("/");
  }

  function handleGoTo(path: string) {
    navigate(path);
    setMenuOpen(false); // Fecha o menu ao navegar
  }

  const menuItems = [{ name: "Inicio", to: "/" }];
  const filteredMenu = menuType === "full" && menuItems;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="flex flex-row items-center justify-between bg-black h-16 md:pr-6 pl-6 w-screen fixed top-0 z-20">
      {/* Logo e Menu em telas maiores */}
      <div className="flex items-center gap-16">
        <div
          className="font-bold text-2xl text-white md:ml-4 cursor-pointer"
          onClick={handleGoToHome}
        >
           <img src={ImgLogo} alt="Logo" className="w-44 h-10" />
        </div>
        <ul className="hidden md:flex md:flex-row md:gap-8 font-light text-white">
          {filteredMenu &&
            filteredMenu.map((item) => (
              <li
                key={item.to}
                className="hover:text-gray-400 cursor-pointer"
                onClick={() => handleGoTo(item.to)}
              >
                {item.name}
              </li>
            ))}
        </ul>
      </div>

      {/* Botão de Login e Menu Sanduíche em telas menores */}
      <div className="flex items-center gap-4 h-full">
        {menuVisible && (
          <div className="md:hidden">
            <button
              ref={buttonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        )}

        {buttonVisible && (
          <button
            className="bg-white text-black w-24 h-full md:h-8 md:rounded-lg hover:bg-gray-200 hover:cursor-pointer md:mr-4"
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </div>

      {/* Menu Sanduíche */}
      {menuOpen && (
        <ul
          ref={menuRef}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-black/70 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center gap-6 py-6 font-light text-white md:hidden z-50 transition-all duration-300"
        >
          {filteredMenu &&
            filteredMenu.map((item) => (
              <li
                key={item.to}
                className="w-full text-center hover:bg-white/10 hover:text-white cursor-pointer py-3 rounded-md transition-all duration-200"
                onClick={() => handleGoTo(item.to)}
              >
                {item.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
