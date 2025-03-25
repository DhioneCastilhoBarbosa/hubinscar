import { motion } from "framer-motion";
import { useState } from "react";

export default function Register() {
  const [tipoConta, setTipoConta] = useState("cliente");
  const [tipoPessoa, setTipoPessoa] = useState("pf");

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-200 min-h-screen pt-24 text-black px-6 ">
      <motion.form 
      className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl mb-8 bg-white p-8 rounded-lg h-full"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 20 }}
      transition={{ duration: 1 }}
      >
        <h1 className="text-black self-start font-semibold text-2xl">Cadastro</h1> {/* Alinhado à esquerda */}

        {/* Campos de email e telefone */}
        <div className="flex flex-col md:items-center items-start w-full gap-4">
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite seu email"
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-52 max-w-lg"
              placeholder="(DDD) x xxxx-xxxx"
            />
          </div>
        </div>
                
        {/* Tipo de conta */}
        <div className="flex flex-row items-center justify-center gap-2 w-full ml-28">
          <p className="w-32">Tipo de conta:</p>
          <div className="flex flex-row gap-2 flex-1">
            <div className="flex flex-row gap-1">
              <input
                type="radio"
                id="cliente"
                name="tipoConta"
                value="cliente"
                checked = {tipoConta === "cliente"}
                onChange={(e) => setTipoConta(e.target.value)}
                className="accent-black"
              />
              <label htmlFor="cliente">Cliente</label>
            </div>
            <div className="flex flex-row gap-1">
              <input
                type="radio"
                id="instalador"
                name="tipoConta"
                value="instalador"
                checked = {tipoConta === "instalador"}
                onChange={(e) => setTipoConta(e.target.value)}
                className="accent-black"
              />
              <label htmlFor="instalador">Instalador</label>
            </div>
          </div>
        </div>

        {/* Tipo de Pessoa */}
        <div className="flex flex-row items-center justify-center gap-2 w-full ml-28">
          <p className="w-32">Tipo de Pessoa:</p>
          <div className="flex flex-row gap-2 flex-1">
            <div className="flex flex-row gap-1">
              <input
                type="radio"
                id="pf"
                name="tipoPessoa"
                value="pf"
                checked = {tipoPessoa === "pf"}
                onChange={(e) => setTipoPessoa(e.target.value)}
                className="accent-black"
              />
              <label htmlFor="pf">Física</label>
            </div>
            <div className="flex flex-row gap-1">
              <input
                type="radio"
                id="pj"
                name="tipoPessoa"
                value="pj"
                checked = {tipoPessoa === "pj"}
                onChange={(e) => setTipoPessoa(e.target.value)}
                className="accent-black"
              />
              <label htmlFor="pj">Jurídica</label>
            </div>
          </div>
        </div>



        <p className="text-lg font-bold pt-2">Dados Pessoais</p>

        {/* Campos de Dados Pessoais */}
        <div className="flex flex-col md:items-center items-start w-full gap-4">
          {tipoPessoa === "pf" ? (
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite seu nome"
            />
          </div>
          ):(
            <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Razão Social</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite sua razão social"
            />
          </div>
          )}

          {tipoPessoa === "pf" ? (
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-52 max-w-lg"
              placeholder="xxx.xxx.xxx-xx"
            />
          </div>
          ):(
            <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="cpf">CNPJ</label>
            <input
              id="CNPJ"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-52 max-w-lg"
              placeholder="xx.xxx.xxx/xxxx-xx"
            />
          </div>
          )}

          {tipoPessoa === "pf" &&(
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="dataNascimento">Data de nascimento</label>
            <input
              id="dataNascimento"
              type="date"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-52 max-w-lg"
             
            />
          </div>
          )}
        </div>

        <p className="text-lg font-bold pt-2">Endereço</p>

        <div className="flex flex-col md:items-center items-start w-full gap-4">
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">CEP</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="xxxxx-xxx"
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Endereço</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite seu endereço"
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Número</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite o número"
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Complemento</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite o complemento"
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Bairro</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite o bairro"
            />
          </div>
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Cidade</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite a cidade"
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Estado</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite o estado"
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Ponto de referência</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-92 max-w-lg"
              placeholder="Digite o ponto de referência"
            />
          </div>

          <div className="flex flex-row items-center justify-center w-full mt-8">
            <button className="bg-black text-white  py-1 rounded-lg w-52  hover:bg-gray-700 hover:cursor-pointer">Cadastrar</button>
          </div>
         
        </div>
        
      </motion.form>
    </div>
  );
}
