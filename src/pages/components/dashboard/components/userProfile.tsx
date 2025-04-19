import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<"perfil" | "endereco" | "senha" | "excluir" >("perfil");

  const [user, setUser] = useState({
    name: "Mauricio Antônio",
    email: "mauricioantonio@gmail.com",
    phone: "48 9999-9999",
    photo: "https://i.pravatar.cc/150?img=12",
  });

  const [address, setAddress] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: "currentPassword" | "newPassword" | "confirmPassword") => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPassword === password.confirmPassword) {
      console.log("Senha alterada com sucesso");
    } else {
      alert("As senhas novas não coincidem");
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, photo: imageUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados salvos:", user);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Endereço salvo:", address);
  };

  // Função para buscar o endereço pelo CEP
  const fetchAddressByCep = useCallback(async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setAddress((prevAddress) => ({
            ...prevAddress,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        } else {
          alert("CEP não encontrado");
        }
      } catch (error) {
        alert("Erro ao buscar o CEP: " + error);
      }
    }
  }, []);

  // UseEffect para atualizar os campos quando o CEP mudar
  useEffect(() => {
    if (address.cep.length === 8) {
      fetchAddressByCep(address.cep);
    }
  }, [address.cep, fetchAddressByCep]);

  return (
    <motion.div className="bg-white rounded-2xl w-full max-w-5xl px-4 py-6 sm:px-6 flex flex-col lg:flex-row lg:mt-0 lg:h-4/5"
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      transition={{ duration: 1 }}
       >
      {/* Sidebar */}
     <div className=" w-full lg:w-48 border-b lg:border-r border-gray-300 lg:pr-6 lg:border-b-0 ">
        <ul className="gap-x-2 lg:space-y-4 text-sm font-medium flex flex-wrap justify-between lg:block">
          <li
            className={`cursor-pointer ${
              activeTab === "perfil" ? "text-black font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "endereco" ? "text-black font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("endereco")}
          >
            Endereço
          </li>
          <li
            className={`cursor-pointer ${
              activeTab === "senha" ? "text-black font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("senha")}
          >
            Senha 
          </li>
          <li className={`text-red-500 cursor-pointer lg:mt-4 lg:border-t-0 lg:border-b border-gray-300 lg:pt-4 ${activeTab === "excluir" ? "font-bold" : "font-normal"}`}
            onClick={() => setActiveTab("excluir")}
          >
            Excluir conta
          </li>
        </ul>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 pl-6 mt-6 lg:mt-0 w-full flex flex-col justify-center">
        {activeTab === "perfil" && (
          <motion.div
          initial={{ opacity: 0}}
          animate={{ opacity: 1}}
          transition={{ duration: 1 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user.photo}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <button
                  type="button"
                  className="bg-white text-sm px-3 py-1.5 rounded shadow cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Carregar nova foto
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">E-mail</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Telefone</label>
                <input
                  type="text"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>
              <div className="pt-2 flex lg:justify-end justify-center">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-md cursor-pointer w-full lg:w-44"
                >
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {activeTab === "endereco" && (
          <motion.div
          initial={{ opacity: 0}}
          animate={{ opacity: 1}}
          transition={{ duration: 1 }}
          >
          <form className="space-y-5" onSubmit={handleAddressSubmit}>
            <div className="w-32">
              <label className="block text-sm mb-1">CEP</label>
              <input
                type="text"
                value={address.cep}
                onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-md"
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Rua</label>
                <input
                  type="text"
                  value={address.rua}
                  onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm mb-1">Número</label>
                <input
                  type="text"
                  value={address.numero}
                  onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Complemento</label>
              <input
                type="text"
                value={address.complemento}
                onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-md"
              />
            </div>
            <div className="flex flex-col lg:flex-row  items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm mb-1">Bairro</label>
                <input
                  type="text"
                  value={address.bairro}
                  onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm mb-1">Cidade</label>
                <input
                  type="text"
                  value={address.cidade}
                  onChange={(e) => setAddress({ ...address, cidade: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm mb-1">UF</label>
                <input
                  type="text"
                  value={address.estado}
                  onChange={(e) => setAddress({ ...address, estado: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Ponto de referência(opcional)</label>
              <input
                type="text"
                value={address.complemento}
                onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                className="w-full px-4 py-2 border border-black rounded-md"
              />
            </div>
            <div className="pt-2 flex justify-center lg:justify-end ">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-md cursor-pointer w-44"
              >
                Salvar
              </button>
            </div>
          </form>
          </motion.div>
        )}

        {activeTab === "senha" && (
              <motion.div
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              transition={{ duration: 1 }}
              >
                  <form onSubmit={handlePasswordSubmit} className="space-y-5 flex flex-col items-center">
                    <div className="w-full lg:w-96">
                      <label className="block text-sm mb-1">Senha Atual</label>
                      <div className="relative">
                        <input
                          type={passwordVisibility.currentPassword ? "text" : "password"}
                          value={password.currentPassword}
                          onChange={(e) =>
                            setPassword({ ...password, currentPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-black rounded-md"
                          placeholder="Digite sua senha atual"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("currentPassword")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {passwordVisibility.currentPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    <div className="w-full lg:w-96">
                      <label className="block text-sm mb-1">Nova Senha</label>
                      <div className="relative">
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

                    <div className="w-full lg:w-96">
                      <label className="block text-sm mb-1">Repetir Nova Senha</label>
                      <div className="relative">
                        <input
                          type={passwordVisibility.confirmPassword ? "text" : "password"}
                          value={password.confirmPassword}
                          onChange={(e) =>
                            setPassword({ ...password, confirmPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-black rounded-md"
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

                    
                  </form>
                  <div className="pt-2 flex justify-center lg:justify-end mt-8">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-md cursor-pointer w-full lg:w-44"
                  >
                    Salvar
                  </button>
                </div>
              </motion.div>
              )}
        {activeTab === "excluir" && (
          <motion.div
          initial={{ opacity: 0}}
          animate={{ opacity: 1}}
          transition={{ duration: 1 }}
          >
            <div className="flex flex-col items-start">
              <h2 className="text-lg lg:text-4xl font-bold mb-8">Excluir Minha Conta</h2>
              <div className="mb-8 text-sm lg:text-lg">
                <p className=" text-gray-500">
                  Sentiremos sua falta! A exclusão da sua conta é irreversível. Todos os seus dados,
                  configurações e históricos serão apagados. 
                </p>
                <p className=" text-gray-500">
                  Se deseja continuar clique no botão excluir conta para confirmar a exclusão. 
                </p>
                <p className=" text-gray-500">
                Caso tenha dúvidas, entre em contato com nosso suporte.
                </p>
              </div>
              
            </div>

            <div className="pt-2 flex justify-center lg:justify-end mt-8">
            <button className="bg-red-500 text-white px-6 py-2 rounded-md cursor-pointer w-full lg:w-44">
                Excluir Conta
              </button>
            </div>
          </motion.div>
        )}
            
      </div>
    </motion.div>
  );
}
