import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../footer";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [isSending, setIsSending] = useState(false);
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
  
    

    try {
      await axios.post("https://mail.api-castilho.com.br/send-email", formData);
      
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      toast.success("Mensagem enviada com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao enviar:", err);
     
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-950 text-black">
      <main className="flex-grow flex flex-col items-center justify-center w-full md:pb-4">
        <div className="flex flex-col items-center justify-center md:w-5/6 mt-20 bg-gray-200 rounded-md max-w-4xl">
          <div className="flex flex-col items-center justify-center w-full gap-6">
            <h1 className="text-gray-900 font-extrabold text-4xl mt-8">Como podemos ajudar?</h1>
            <p className="mx-4">Envie para a nossa equipe suas dúvidas, sugestões e reclamações. Estaremos prontos para te ajudar.</p>
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-6 mt-8">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full gap-4 p-6">
              <div className="flex md:flex-row flex-col w-full gap-4">
                <div className="flex flex-col md:w-1/2">
                  <label className="mb-1 text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Digite seu nome"
                    required
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
                <div className="flex flex-col md:w-1/2">
                  <label className="mb-1 text-sm font-medium text-gray-700">Sobrenome</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Digite seu sobrenome"
                    required
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="flex md:flex-row flex-col w-full gap-4">
                <div className="flex flex-col md:w-1/2">
                  <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Digite seu email"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
                <div className="flex flex-col md:w-1/2">
                  <label className="mb-1 text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(xx)xxxxx-xxxx"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full md:w-1/2 self-start">
                <label className="mb-1 text-sm font-medium text-gray-700">Assunto</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Digite o assunto"
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm font-medium text-gray-700">Mensagem</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Digite sua mensagem"
                  className="p-2 border border-gray-300 rounded-md h-44 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="bg-black text-white py-2 px-4 w-64 rounded-lg hover:bg-gray-700"
                disabled={isSending}
              >
                {isSending ? "Enviando..." : "Enviar"}
              </button>

              
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
