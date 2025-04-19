import { useNavigate } from "react-router-dom";

export default function HeaderDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    // Aqui você pode adicionar lógica de logout
    navigate("/signin");
  }

  return (
    <header className="w-full h-16 fixed top-0 left-0 bg-black text-white z-50 flex items-center justify-between px-4 md:px-6 shadow-md">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer"
      >
        LOGO
      </div>

      {/* Botão de sair */}
      <button
        onClick={handleLogout}
        className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200 transition-colors text-sm md:text-base w-24"
      >
        Sair
      </button>
    </header>
  );
}
