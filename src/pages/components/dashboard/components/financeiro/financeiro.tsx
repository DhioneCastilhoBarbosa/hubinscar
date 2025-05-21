import { JSX, useEffect, useState } from "react";
import {
  Banknote,
  HandCoins,
  CheckCircle,
  FileText,
  PiggyBank,
} from "lucide-react";
import api from "../../../../../services/api";

export default function FinanceiroDashboard() {
  const [resumo, setResumo] = useState({
    disponivel: 0,
    aReceber: 0,
    servicosRealizados: 0,
    valorDosServicos: 0,
  });

  const [bankInfo, setBankInfo] = useState({
    nome: "",
    cpf: "",
    chavePix: "",
    banco: "",
  });

  const [valorSaque, setValorSaque] = useState("");
  const [erroSaque, setErroSaque] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankInfo({ ...bankInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valor = parseFloat(valorSaque.replace(",", "."));
    if (isNaN(valor) || valor <= 0) {
      setErroSaque("Informe um valor válido para saque.");
      return;
    }

    if (valor > resumo.disponivel) {
      setErroSaque("Valor solicitado é maior que o disponível para saque.");
      return;
    }

    setErroSaque("");
    console.log("Dados bancários enviados:", { ...bankInfo, valor_saque: valor });
    // Envie para sua API aqui
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
          {["Nome", "CPF/CNPJ", "ChavePix", "Banco"].map((field) => (
            <div className="flex flex-col" key={field}>
              <label className="text-sm text-gray-400 mb-1 capitalize">
                {field === "chavePix" ? "Chave Pix" : field}
              </label>
              <input
                type="text"
                name={field}
                value={bankInfo[field as keyof typeof bankInfo]}
                onChange={handleChange}
                className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2"
                required
              />
            </div>
          ))}

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm text-gray-400 mb-1">Valor a sacar (R$)</label>
            <input
              type="text"
              value={valorSaque}
              onChange={(e) => setValorSaque(e.target.value)}
              className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2"
              placeholder="Ex: 100.00"
              required
            />
            {erroSaque && (
              <span className="text-red-500 text-sm mt-1">{erroSaque}</span>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Solicitar saque
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
