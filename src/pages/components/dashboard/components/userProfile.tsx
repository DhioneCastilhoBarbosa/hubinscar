import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import api from "../../../../services/api";
import ImgAvatar from "../../../../assets/avatar.jpeg";
import { toast } from "sonner";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<"perfil" | "senha" | "excluir">(
    "perfil"
  );

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    company_name: "",
    cnpj: "",
    photo: ImgAvatar as string,
  });

  const [address, setAddress] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    reference: "",
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const togglePasswordVisibility = (
    field: "currentPassword" | "newPassword" | "confirmPassword"
  ) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ID = localStorage.getItem("ID");
    if (!ID) {
      toast.error("ID do usuário não encontrado.");
      return;
    }

    // Preview local
    const imageUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, photo: imageUrl }));

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await api.put(`/user/${ID}/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newPhotoUrl = response.data.photo;
      localStorage.setItem("photo", newPhotoUrl);
      window.dispatchEvent(new Event("photoUpdated"));
      toast.success("Foto atualizada com sucesso");
    } catch (err: any) {
      console.error(
        "Erro ao atualizar foto:",
        err?.response?.data || err?.message || err
      );
      toast.error("Erro ao atualizar a foto.");
    }
  };

  const fetchAddressByCep = useCallback(async (cep: string) => {
    const onlyNums = cep.replace(/\D/g, "");
    if (onlyNums.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${onlyNums}/json/`
        );
        const data = await response.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        }
      } catch {
        toast.error("Erro ao buscar o CEP");
      }
    }
  }, []);

  // >>>> CAPTURA USUÁRIO DA API <<<<
  useEffect(() => {
    const ID = localStorage.getItem("ID");
    if (!ID) return;

    const fetchUser = async () => {
      try {
        const response = await api.get(`/user/list?id=${ID}`);
        const data = response.data[0];

        // Prioriza name; senão company_name; fallback username
        const rawName = data?.name || data?.username || "";
        const rawCompany = data?.company_name || "";
        const displayName = (rawName || rawCompany || "").trim();

        const cpf = data?.cpf || "";
        const cnpj = data?.cnpj || "";

        setUser({
          name: displayName,
          company_name: displayName,
          email: data?.email || "",
          phone: data?.phone || "",
          cpf,
          cnpj,
          photo: data?.photo ? data.photo : ImgAvatar,
        });

        setAddress({
          cep: data?.cep || "",
          rua: data?.street || "",
          numero: data?.number || "",
          complemento: data?.complement || "",
          reference: data?.reference || "",
          bairro: data?.neighborhood || "",
          cidade: data?.city || "",
          estado: data?.state || "",
        });
      } catch (err) {
        console.error("Erro ao buscar dados do usuário", err);
      }
    };

    fetchUser();
  }, []);

  // Atualiza campos via CEP
  useEffect(() => {
    if (address.cep) fetchAddressByCep(address.cep);
  }, [address.cep, fetchAddressByCep]);

  // >>>> SALVAR PERFIL (JSON em /user/:id) <<<<
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ID = localStorage.getItem("ID");
    if (!ID) {
      toast.error("ID do usuário não encontrado.");
      return;
    }

    const displayName = (
      user.name?.trim() ||
      user.company_name?.trim() ||
      ""
    ).trim();

    // Mapeia somente campos editáveis
    const payload: Record<string, string> = {
      name: displayName,
      company_name: displayName,
      phone: user.phone || "",
      cep: address.cep || "",
      street: address.rua || "",
      number: address.numero || "",
      complement: address.complemento || "",
      reference: address.reference || "",
      neighborhood: address.bairro || "",
      city: address.cidade || "",
      state: address.estado || "",
    };

    // Remove chaves vazias para evitar sobrescrita com ""
    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") delete payload[k];
    });

    try {
      const res = await api.put(`/user/${ID}`, payload); // JSON
      toast.success("Perfil atualizado com sucesso!");
      if (res?.data) {
        setUser((prev) => ({
          ...prev,
          name: res.data.name ?? displayName,
          company_name: res.data.company_name ?? displayName,
          phone: res.data.phone ?? prev.phone,
        }));
        setAddress((prev) => ({
          ...prev,
          cep: res.data.cep ?? prev.cep,
          rua: res.data.street ?? prev.rua,
          numero: res.data.number ?? prev.numero,
          complemento: res.data.complement ?? prev.complemento,
          reference: res.data.reference ?? prev.reference,
          bairro: res.data.neighborhood ?? prev.bairro,
          cidade: res.data.city ?? prev.cidade,
          estado: res.data.state ?? prev.estado,
        }));
      }
    } catch (err: any) {
      console.error(
        "Erro ao atualizar perfil:",
        err?.response?.status,
        err?.response?.data || err?.message
      );
      toast.error(
        err?.response?.data?.message || "Erro ao atualizar o perfil."
      );
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ID = localStorage.getItem("ID");
    if (!ID) {
      toast.error("ID do usuário não encontrado.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      toast.error("As senhas novas não coincidem.");
      return;
    }

    try {
      await api.put(`/user/${ID}/password`, {
        new_password: password.newPassword,
      });
      toast.success("Senha atualizada com sucesso!");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.error(
        "Erro ao atualizar senha:",
        err?.response?.status,
        err?.response?.data || err?.message
      );
      toast.error("Erro ao atualizar a senha.");
    }
  };

  const docLabel = user.cpf ? "CPF" : user.cnpj ? "CNPJ" : "Documento";
  const docValue = user.cpf || user.cnpj;

  return (
    <motion.div
      className="bg-white rounded-2xl w-full max-w-4xl px-4 py-6 sm:px-6 mx-auto flex flex-col lg:flex-row gap-6 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Sidebar */}
      <div className="w-full lg:w-48 border-b lg:border-r border-gray-300 lg:pr-6 lg:border-b-0">
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
              activeTab === "senha" ? "text-black font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("senha")}
          >
            Senha
          </li>
          <li
            className={`text-red-500 cursor-pointer md:mt-4 md:border-t md:pt-4 border-gray-300 ${
              activeTab === "excluir" ? "font-bold" : "font-normal"
            }`}
            onClick={() => setActiveTab("excluir")}
          >
            Excluir conta
          </li>
        </ul>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 w-full flex flex-col justify-start items-center overflow-y-auto">
        {activeTab === "perfil" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col h-full"
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
                  value={user.name || user.company_name}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      name: e.target.value,
                      company_name: e.target.value, // sincronizado
                    }))
                  }
                  className="w-full max-w-md px-4 py-2 border border-black rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">E-mail</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full max-w-md px-4 py-2 border border-black rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Telefone</label>
                <input
                  type="text"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full max-w-md md:w-56 px-4 py-2 border border-black rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">{docLabel}</label>
                <input
                  type="text"
                  value={docValue}
                  readOnly
                  className="w-full max-w-md md:w-56 px-4 py-2 border border-black rounded-md bg-zinc-200"
                  disabled
                />
              </div>

              <hr className="my-8 border-gray-300" />
              <h2 className="text-lg font-semibold mb-4">Endereço</h2>

              <div className="w-32">
                <label className="block text-sm mb-1">CEP</label>
                <input
                  type="text"
                  value={address.cep}
                  onChange={(e) =>
                    setAddress({ ...address, cep: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Rua</label>
                  <input
                    type="text"
                    value={address.rua}
                    onChange={(e) =>
                      setAddress({ ...address, rua: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-black rounded-md"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm mb-1">Número</label>
                  <input
                    type="text"
                    value={address.numero}
                    onChange={(e) =>
                      setAddress({ ...address, numero: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-black rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Complemento</label>
                <input
                  type="text"
                  value={address.complemento}
                  onChange={(e) =>
                    setAddress({ ...address, complemento: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-sm mb-1">Bairro</label>
                  <input
                    type="text"
                    value={address.bairro}
                    onChange={(e) =>
                      setAddress({ ...address, bairro: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-black rounded-md"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm mb-1">Cidade</label>
                  <input
                    type="text"
                    value={address.cidade}
                    onChange={(e) =>
                      setAddress({ ...address, cidade: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-black rounded-md"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm mb-1">UF</label>
                  <input
                    type="text"
                    value={address.estado}
                    onChange={(e) =>
                      setAddress({ ...address, estado: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-black rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Ponto de referência (opcional)
                </label>
                <input
                  type="text"
                  value={address.reference}
                  onChange={(e) =>
                    setAddress({ ...address, reference: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-black rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-center lg:justify-end">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5 flex flex-col items-center"
            >
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {passwordVisibility.newPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-96">
                <label className="block text-sm mb-1">Repetir Nova Senha</label>
                <div className="relative">
                  <input
                    type={
                      passwordVisibility.confirmPassword ? "text" : "password"
                    }
                    value={password.confirmPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-black rounded-md"
                    placeholder="Digite novamente a nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {passwordVisibility.confirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </form>

            <div className="pt-2 flex justify-center lg:justify-center mt-8">
              <button
                type="submit"
                onClick={handlePasswordSubmit}
                className="bg-black text-white px-6 py-2 rounded-md cursor-pointer w-full lg:w-44"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "excluir" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col items-start">
              <h2 className="text-lg lg:text-4xl font-bold mb-8">
                Excluir Minha Conta
              </h2>
              <div className="mb-8 text-sm lg:text-lg">
                <p className="text-gray-500">
                  A exclusão da sua conta é irreversível. Todos os seus dados
                  serão apagados.
                </p>
                <p className="text-gray-500">
                  Se deseja continuar, clique em excluir conta.
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
