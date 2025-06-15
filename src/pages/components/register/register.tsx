import api from "../../../services/api"
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cpf, cnpj } from 'cpf-cnpj-validator';



export default function RegisterClient() {
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

  function handleClicPartners(){
    navigate("/cadastro-parceiro");
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
    role: "cliente",
    type_person: "cliente",
    photo: "", // ou link da imagem se tiver
  };

  try {
    await api.post("/user/register", payload);
    toast.success("Cadastro realizado com sucesso!");
    navigate("/signin"); // ou redirecionamento desejado
  } catch (error) {
    toast.error("Erro ao cadastrar usuário.");
    console.error("Erro ao registrar:", error);
  }
};

    useEffect(() => {
      const fetchAddressByCep = async () => {
        const cep = formData.cep.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (cep.length !== 8) return; // CEP inválido

        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (data.erro) {
            toast.error("CEP não encontrado.");
            return;
          }

          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
            complement: data.complemento || "",
          }));
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          toast.error("Erro ao buscar o CEP.");
        }
      };

      if (formData.cep) {
        fetchAddressByCep();
      }
    }, [formData.cep]);




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
        <h1 className="text-black self-start font-semibold text-2xl">Cadastro do Cliente</h1> {/* Alinhado à esquerda */}
        <p className="text-sm self-start mb-8">Para cadastrar como instalador parceiro clique <strong className="cursor-pointer text-red-700" onClick={handleClicPartners}>aqui.</strong></p>
        {/* Campos de email e telefone */}
        <div className="flex flex-col md:items-center items-start w-full gap-4">
          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="h-10 rounded-lg outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black py-0.5 px-2 md:w-92 max-w-lg"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
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
              required
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
                  required
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
                  required
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
                required
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
                required
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
              required
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
              required
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
              onChange={(e) => {
                const rawValue = e.target.value;
                const stripped = cpf.strip(rawValue); // remove pontos e traços
                const formatted = cpf.format(stripped); // aplica máscara
                setFormData({ ...formData, cpf: formatted });
              }}
              onBlur={() => {
                if (!cpf.isValid(formData.cpf)) {
                  toast.error('CPF inválido');
                }
              }}
              required
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
              onChange={(e) => {
                const rawValue = e.target.value;
                const stripped = cnpj.strip(rawValue);
                const formatted = cnpj.format(stripped);
                setFormData({ ...formData, cnpj: formatted });
              }}
              onBlur={() => {
                if (!cnpj.isValid(formData.cnpj)) {
                  toast.error('CNPJ inválido');
                }
              }}
              required
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
              required
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
              onChange={(e) => {
                const rawCep = e.target.value.replace(/\D/g, "");
                const maskedCep = rawCep.replace(/^(\d{5})(\d{0,3})/, "$1-$2");
                setFormData({ ...formData, cep: maskedCep });
              }}
              required
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
              required
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
              required
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
              required
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
              required
            />
          </div>

          <div className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 w-full">
            <label className="w-44 md:text-right" htmlFor="estado">Estado</label>
            <select
              id="estado"
                className="h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black py-0.5 px-2 md:w-92 max-w-lg"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            >
              <option value="">Selecione o estado</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
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
                required
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
