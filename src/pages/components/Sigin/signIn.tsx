import { motion } from "framer-motion";
import { Eye, EyeClosed, Lock, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../hooks/userAuth";
import { toast } from "sonner";
import ReactGA from 'react-ga4';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await signIn(email, password);
      toast.success("Login realizado com sucesso!");
    } catch {
      toast.error("E-mail ou senha inválidos");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-200 h-screen px-2">
      <motion.div
        className="flex md:flex-row flex-col md:w-[56rem] md:h-[32rem] bg-white rounded-lg gap-8 w-full items-center justify-center pb-4 md:pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center justify-center md:w-[24rem] w-full h-full bg-black md:rounded-l-lg gap-8 p-4 rounded-t-lg md:rounded-t-none">
          <div className="flex flex-col items-center justify-center gap-1 text-2xl font-extrabold text-white">
            <h1>Olá</h1>
            <h1>Seja bem-vindo!</h1>
          </div>
          <p className="text-white">Não tem conta?</p>
          <button
            className="bg-white text-black w-36 h-10 rounded-lg hover:bg-gray-200 hover:cursor-pointer"
            onClick={() => {
              // Rastrear evento com ReactGA4
              ReactGA.event({
                category: 'Botão',
                action: 'Clique em Solicitar Cadastrar em Pagina de Login',
                label: 'Cadastrar',
              });
          
              // Pequeno delay para garantir o envio do evento
              setTimeout(() => {
                window.location.href = "/register";
              }, 300); // 300ms (pode ajustar se quiser)
            }}
          >
            Cadastrar
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-[32rem] h-full gap-4">
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center justify-center gap-4 h-full"
          >
            <h1 className="text-black self-start font-semibold text-2xl">
              Login
            </h1>

            <div className="flex flex-row items-center bg-gray-100 rounded-lg w-72 h-10 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5">
              <UserRound size={24} className="text-black ml-4" />
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-full placeholder:text-gray-500 pl-4 bg-transparent border-none outline-none text-black"
              />
            </div>

            <div className="flex flex-row items-center bg-gray-100 rounded-lg w-72 h-10 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5">
              <Lock size={24} className="text-black ml-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite a sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full pl-4 bg-transparent border-r-2 border-gray-400 outline-none text-black placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-black pr-2"
              >
                {showPassword ? <Eye size={24} /> : <EyeClosed size={24} />}
              </button>
            </div>

            <p className="self-end text-sm text-gray-600 cursor-pointer hover:underline">
              Esqueceu a senha?
            </p>

            <button
              type="submit"
              className="bg-black text-white w-72 h-10 rounded-lg hover:bg-gray-700"
            >
              Entrar
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
