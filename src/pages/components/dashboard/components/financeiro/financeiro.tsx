import { JSX, useEffect, useState } from "react";
import {
  Banknote,
  HandCoins,
  CheckCircle,
  FileText,
  PiggyBank,
} from "lucide-react";
import api from "../../../../../services/api";
import { toast } from "sonner";

export default function FinanceiroDashboard() {
  const [resumo, setResumo] = useState({
    disponivel: 0,
    aReceber: 0,
    servicosRealizados: 0,
    valorDosServicos: 0,
  });

  const [isLoading, setIsLoading] = useState(false);


  const [bankInfo, setBankInfo] = useState({
    nome: "",
    cpf: "",
    chavePix: "",
    banco: "",
  });

  const fields = [
  { label: "Nome", name: "nome" },
  { label: "CPF/CNPJ", name: "cpf" },
  { label: "Chave Pix", name: "chavePix" },
  
];

const bancosBrasil = [
  { codigo: "001", nome: "Banco do Brasil" },
  { codigo: "033", nome: "Santander" },
  { codigo: "104", nome: "Caixa Econômica Federal" },
  { codigo: "237", nome: "Bradesco" },
  { codigo: "341", nome: "Itaú Unibanco" },
  { codigo: "260", nome: "Nubank" },
  { codigo: "077", nome: "Banco Inter" },
  { codigo: "290", nome: "PagBank" },
  { codigo: "336", nome: "C6 Bank" },
  { codigo: "380", nome: "PicPay" },
  { codigo: "655", nome: "Votorantim" },
  { codigo: "748", nome: "Sicredi" },
  { codigo: "756", nome: "Sicoob" },
  { codigo: "741", nome: "Banrisul" },
  { codigo: "422", nome: "Safra" },
  { codigo: "389", nome: "Mercantil do Brasil" },
  { codigo: "070", nome: "Banco de Brasília (BRB)" },
  { codigo: "021", nome: "Banestes" },
  { codigo: "136", nome: "Unicred" },
  { codigo: "643", nome: "Pine" },
  { codigo: "012", nome: "Banco Inbursa" },
];



  const [valorSaque, setValorSaque] = useState("");
  const [erroSaque, setErroSaque] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

  // CPF/CNPJ: remover tudo que não for número
  if (name === "cpf") {
    const onlyDigits = value.replace(/\D/g, "");
    setBankInfo((prev) => ({ ...prev, [name]: onlyDigits }));
    return;
  }

  setBankInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const valor = parseFloat(valorSaque.replace(/\./g, "").replace(",", "."));

  if (isNaN(valor) || valor <= 0) {
    setErroSaque("Informe um valor válido para saque.");
    return;
  }

  if (valor > resumo.disponivel) {
    setErroSaque("Valor solicitado é maior que o disponível para saque.");
    return;
  }

 
  const id = localStorage.getItem("ID");
  if (!id) {
    setErroSaque("ID do usuario não identificado.");
    return;
  }

  // Identificar CPF ou CNPJ
  const digitsOnly = bankInfo.cpf.replace(/\D/g, "");
  const isCNPJ = digitsOnly.length > 11;

  const payload = {
    id,
    name: bankInfo.nome,
    cpf: isCNPJ ? "" : bankInfo.cpf,
    cnpj: isCNPJ ? bankInfo.cpf : "",
    key: bankInfo.chavePix,
    bank_name: bankInfo.banco,
    value: valor,
    request_date: new Date().toISOString().split("T")[0],
  };

  try {
    console.log("Enviando solicitação de saque:", payload);
    await fetch("https://mail.api-castilho.com.br/withdrawal-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    toast.success("Solicitação de saque enviada com sucesso!");
    setValorSaque("");
    setBankInfo({ nome: "", cpf: "", chavePix: "", banco: "" });
  } catch (err) {
    console.error("Erro ao enviar solicitação:", err);
    setErroSaque("Erro ao enviar solicitação. Tente novamente.");
    setIsLoading(false);
  }finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    const fetchBudgets = async () => {
      const installerId = localStorage.getItem("ID");
      if (!installerId) return;

      try {
        const response = await api.get(
          `/api/v1/budget/?installer_id=${installerId}`
        );

        const budgets = response.data || [];

        let disponivel = 0;
        let aReceber = 0;
        let servicosRealizados = 0;
        let valorTotal = 0;

        budgets.forEach((budget: { status: string; value: string }) => {
          if (budget.status === "cancelado") return;

          servicosRealizados += 1;
          valorTotal += Number(budget.value) || 0;

          if (budget.status === "concluido") {
            disponivel += Number(budget.value) || 0;
          } else {
            aReceber += Number(budget.value) || 0;
          }
        });

        setResumo({
          disponivel,
          aReceber,
          servicosRealizados,
          valorDosServicos: valorTotal,
        });
      } catch (error) {
        console.error("Erro ao buscar dados financeiros:", error);
      }
    };

    fetchBudgets();
  }, []);

  return (
    <div className="bg-zinc-900 text-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto mt-5 space-y-6 border border-zinc-700">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <PiggyBank className="text-green-500" />
        Resumo Financeiro
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResumoCard icon={<Banknote className="text-green-400" />} label="Disponível para saque" value={resumo.disponivel} color="text-green-300" />
        <ResumoCard icon={<HandCoins className="text-yellow-400" />} label="A receber" value={resumo.aReceber} color="text-yellow-300" />
        <ResumoCard icon={<CheckCircle className="text-blue-400" />} label="Total de serviços" value={resumo.servicosRealizados} color="text-blue-300" isNumber />
        <ResumoCard icon={<FileText className="text-purple-400" />} label="Valor total dos serviços" value={resumo.valorDosServicos} color="text-purple-300" />
      </div>

      <div className="pt-4 border-t border-zinc-700">
        <h3 className="text-xl font-semibold mb-2">Dados bancários (Pix)</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ label, name }) => (
            <div className="flex flex-col" key={name}>
              <label className="text-sm text-gray-400 mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={bankInfo[name as keyof typeof bankInfo]}
                onChange={handleChange}
                className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2"
                required
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Banco</label>
            <select
              name="banco"
              value={bankInfo.banco}
              onChange={(e) =>
                setBankInfo((prev) => ({ ...prev, banco: e.target.value }))
              }
              className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2"
              required
            >
              <option value="">Selecione um banco</option>
              {bancosBrasil.map((banco) => (
                <option key={banco.codigo} value={banco.nome}>
                  {banco.codigo} - {banco.nome}
                </option>
              ))}
            </select>
          </div>



          <div className="flex flex-col md:col-span-2">
            <label className="text-sm text-gray-400 mb-1">Valor a sacar (R$)</label>
            <input
                type="text"
                value={valorSaque}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, ""); // só dígitos
                  const float = (parseInt(raw || "0") / 100).toFixed(2); // 10 → 10.00
                  const formatted = Number(float).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                  setValorSaque(formatted);
                }}
                className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2"
                placeholder="Ex: 100,00"
                required
              />
            {erroSaque && (
              <span className="text-red-500 text-sm mt-1">{erroSaque}</span>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Enviando..." : "Solicitar saque"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

function ResumoCard({
  icon,
  label,
  value,
  color,
  isNumber = false,
}: {
  icon: JSX.Element;
  label: string;
  value: number;
  color: string;
  isNumber?: boolean;
}) {
  return (
    <div className="bg-zinc-800 p-4 rounded-lg flex items-center gap-4">
      {icon}
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>
          {isNumber ? value : `R$ ${value.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
}
