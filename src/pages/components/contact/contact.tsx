import { useEffect } from "react";
import Footer from "../footer";

export default function Contact() { 

     useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
  <div className="flex flex-col items-center justify-center w-full bg-stone-950 min-h-screen text-black md:pb-4">
    <div className="flex flex-col items-center justify-center md:w-5/6 mt-20 bg-gray-200 rounded-md">
     <div className="flex flex-col items-center justify-center w-full gap-6">
      <h1 className="text-gray-900 font-extrabold text-4xl mt-8">Como podemos ajudar?</h1>
      <p className="mx-4">Envie para a nossa equipe suas duvidas, sugestões e reclamação, estaremos prontos para te ajudar.</p>
     </div>
     <div className="flex flex-col items-center justify-center w-full gap-6 mt-8">
     <form className="flex flex-col items-center justify-center w-full gap-4 p-6">

{/* Nome + Sobrenome */}
<div className="flex md:flex-row flex-col w-full gap-4">
  <div className="flex flex-col md:w-1/2">
    <label className="mb-1 text-sm font-medium text-gray-700">Nome</label>
    <input type="text" placeholder="Digite seu nome" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black
" />
  </div>
  <div className="flex flex-col md:w-1/2">
    <label className="mb-1 text-sm font-medium text-gray-700">Sobrenome</label>
    <input type="text" placeholder="Digite seu sobrenome" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black
" />
  </div>
</div>

{/* Email + Telefone */}
<div className="flex md:flex-row flex-col w-full gap-4">
  <div className="flex flex-col md:w-1/2">
    <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
    <input type="email" placeholder="Digite seu email" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black
" />
  </div>
  <div className="flex flex-col md:w-1/2">
    <label className="mb-1 text-sm font-medium text-gray-700">Telefone</label>
    <input type="tel" placeholder="(xx)xxxx-xxxx" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black
" />
  </div>
</div>

{/* Assunto */}
<div className="flex flex-col w-full md:w-1/2 self-start">
  <label className="mb-1 text-sm font-medium text-gray-700">Assunto</label>
  <input type="text" placeholder="Digite o assunto" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black
" />
</div>

{/* Mensagem */}
<div className="flex flex-col w-full">
  <label className="mb-1 text-sm font-medium text-gray-700">Mensagem</label>
  <textarea placeholder="Digite sua mensagem" className="p-2 border border-gray-300 rounded-md h-44 focus:outline-none focus:ring-1 focus:ring-black focus:border-black
"></textarea>
</div>

{/* Botão */}
<button type="submit" className="bg-black text-white py-2 px-4 w-64 rounded-lg hover:bg-gray-700 hover:cursor-pointer">
  Enviar
</button>

</form>

     </div>
    </div>
    <div className=" flex flex-col items-center">
      <Footer/>
    </div>
  </div>)
}