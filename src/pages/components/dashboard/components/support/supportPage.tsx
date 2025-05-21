import { useEffect, useState } from "react";

import { MessageCircleQuestion, Mail, User, Phone } from "lucide-react";
import api from "../../../../../services/api";

export default function Support() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Mensagem enviada:", formData);
    setMensagemSucesso("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
  };
  

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("ID");
      
      if (!userId) return;

      try {
        const response = await api.get(
          `/user/list?id=${userId}`
        );
        

        const user = response.data[0];
        
        if (user && user.username && user.email) {
          setFormData((prev) => ({
            ...prev,
            nome: user.username,
            email: user.email,
            telefone: user.phone || "",
          }));
        }
        
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserInfo();
  }, []);
  
  return (
    <div className="bg-zinc-900 text-white rounded-xl p-6 shadow-lg max-w-3xl mx-auto mt-10 space-y-6 border border-zinc-700">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageCircleQuestion className="text-blue-400" />
        Suporte ao Usuário
      </h2>

      <p className="text-gray-400 text-sm">
        Precisa de ajuda? Preencha o formulário abaixo e nossa equipe de suporte entrará em contato.
      </p>

      {mensagemSucesso && (
        <div className="bg-green-600 text-white p-3 rounded-lg text-sm">{mensagemSucesso}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-1">
            <User size={16} /> Nome completo
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2"
            required
            readOnly
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-1">
            <Mail size={16} /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2"
            required
            readOnly
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-1">
            <Phone size={16} /> Telefone (opcional)
          </label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2"
            placeholder="(xx) xxxxx-xxxx"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">Descreva seu problema</label>
          <textarea
            name="mensagem"
            rows={5}
            value={formData.mensagem}
            onChange={handleChange}
            className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2 resize-none"
            placeholder="Explique detalhadamente o que está acontecendo..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Enviar solicitação
        </button>
      </form>
    </div>
  );
}
