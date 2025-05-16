import { Eye, EyeOff } from "lucide-react";
import api from "../../../services/api"
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function RegisterPart() {
  const [tipoPessoa, setTipoPessoa] = useState("pf");
  const [aceite, setAceite] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cnpj: "",
    CompanyName: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
    cep: "",
    reference: "",
    birth_date: "",
  });

  const [password, setPassword] = useState({
    
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordVisibility, setPasswordVisibility] = useState({
   
    newPassword: false,
    confirmPassword: false,
  })

  const senhaInvalida = password.newPassword !== password.confirmPassword;

  const togglePasswordVisibility = (field: "newPassword" | "confirmPassword") => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const navigate = useNavigate();
  function handleClicClient(){
    navigate("/register");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!aceite) {
      alert("Você deve aceitar os termos para continuar.");
      return;
    }

    const payload = {
      name: formData.name,
      company_name: formData.CompanyName,
      email: formData.email,
      password: password.newPassword,
      phone: formData.phone,
      cpf: formData.cpf,
      cnpj: formData.cnpj,
      tipe_person: tipoPessoa === "pf" ? "fisico" : "juridico",
      street: formData.street,
      number: formData.number,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      complement: formData.complement,
      cep: formData.cep,
      reference: formData.reference,
      birth_date: formData.birth_date,
      accept_terms: aceite,
      role: "instalador",
      type_person: "instalador",
      photo: "", // ou link da imagem se tiver
    };

    try {
      await api.post("/user/register", payload);
      toast.success("Cadastro realizado com sucesso. Vamos avaliar as suas informações e entraremos em contato por email ou pelo telefone.", {
        duration: 6000 // em milissegundos (8 segundos)
      });
      navigate("/parceiros"); // ou redirecionamento desejado
    } catch (error) {
      toast.error("Erro ao cadastrar usuário.");
      console.error("Erro ao registrar:", error);
    }
  };


    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-200 min-h-screen pt-24 text-black px-6 ">
      <motion.form 
      className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl mb-8 bg-white p-8 rounded-lg h-full"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 20 }}
      transition={{ duration: 1 }}
      onSubmit={handleSubmit} 
      >
        <h1 className="text-black self-start font-semibold text-2xl">Cadastro do Instalador</h1> {/* Alinhado à esquerda */}
        <p className="text-sm self-start mb-8">Para cadastrar como cliente click <strong className="cursor-pointer" onClick={handleClicClient}>aqui</strong></p>
        {/* Campos de email e telefone */}
        <div className="flex flex-col md:items-center items-start w-full gap-4">
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite seu email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 w-52 max-w-lg"
              placeholder="(DDD) x xxxx-xxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right">Senha</label>
            <div className="relative md:w-92 w-full max-w-lg">
               <input
                  type={passwordVisibility.newPassword ? "text" : "password"}
                  value={password.newPassword}
                  onChange={(e) =>
                  setPassword({ ...password, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-black rounded-md"
                  placeholder="Digite a nova senha"
                />
                  <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                  {passwordVisibility.newPassword ? <EyeOff /> : <Eye />}
                  </button>
              </div>
          </div>
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right">Repetir Nova Senha</label>
              <div className="relative md:w-92 w-full max-w-lg">
                <input
                  type={passwordVisibility.confirmPassword ? "text" : "password"}
                  value={password.confirmPassword}
                  onChange={(e) =>
                    setPassword({ ...password, confirmPassword: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-md ${
                    senhaInvalida ? "border-red-500" : "border-black"
                  }`}
                  placeholder="Digite novamente a nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 sla"
                  >
                  {passwordVisibility.confirmPassword ? <EyeOff /> : <Eye />}
                  </button>
              </div>
                  
          </div>
          {senhaInvalida && (
              <p className="text-red-500 text-sm mt-0.5">
                  As senhas não coincidem.
              </p>
          )}
        </div>
                
       
        {/* Tipo de Pessoa */}
        <div className="flex flex-row items-center justify-center gap-2 w-full md:ml-28">
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
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          ):(
            <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Razão Social</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite sua razão social"
              value={formData.CompanyName}
              onChange={(e) => setFormData({ ...formData, CompanyName: e.target.value })}
            />
          </div>
          )}

          {tipoPessoa === "pf" ? (
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-52 max-w-lg"
              placeholder="xxx.xxx.xxx-xx"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            />
          </div>
          ):(
            <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="cpf">CNPJ</label>
            <input
              id="CNPJ"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-52 max-w-lg"
              placeholder="xx.xxx.xxx/xxxx-xx"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            />
          </div>
          )}

          {tipoPessoa === "pf" &&(
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="dataNascimento">Data de nascimento</label>
            <input
              id="dataNascimento"
              type="date"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-52 max-w-lg"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
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
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="xxxxx-xxx"
              value={formData.cep}
              onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Endereço</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite seu endereço"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Número</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite o número"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Complemento</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite o complemento"
              value={formData.complement}
              onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Bairro</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite o bairro"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            />
          </div>
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Cidade</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite a cidade"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Estado</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite o estado"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="nome">Ponto de referência</label>
            <input
              id="nome"
              type="text"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite o ponto de referência"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>

          <div>
          <label className="flex items-start space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
                className="mt-1"
                value={formData.email}
              />
              <span>
                Li e concordo com os{" "}
                <a href="/termos-de-uso" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a href="/politica-de-privacidade" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade
                </a>.
              </span>
            </label>
          </div>

          <div className="flex flex-row items-center justify-center w-full mt-8">
            <button 
            className="bg-black text-white  py-1 rounded-lg w-52  hover:bg-gray-700 hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!aceite || senhaInvalida}
            >
              Cadastrar
            </button>
          </div>
         
        </div>
        
      </motion.form>
    </div>
  );
}
