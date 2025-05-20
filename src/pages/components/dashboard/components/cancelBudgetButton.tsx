import { useState } from "react";
import { toast } from "sonner";
import api from "../../../../services/api";

interface CancelBudgetButtonProps {
  id: number;
  status: string;
  onCancelSuccess?: () => void;
}

export default function CancelBudgetButton({ id, status, onCancelSuccess }: CancelBudgetButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/api/v1/budget/${id}/status`, {
        status: "cancelado",
      });

      if (res.status === 200) {
        toast.success("Orçamento cancelado com sucesso.");
        setConfirmOpen(false);
        if (onCancelSuccess) onCancelSuccess(); // callback do pai para recarregar
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cancelar orçamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left w-full">
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={status === "cancelado"}
        className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm justify-center border transition-colors duration-200
          ${status === "cancelado"
            ? "bg-zinc-600 text-zinc-300 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 text-white border-transparent"}`}
      >
        {status === "cancelado" ? "Cancelado" : "Cancelar"}
      </button>

      {confirmOpen && (
        <div className="absolute z-10 right-0 mt-2 w-64 bg-white text-black rounded shadow-lg border border-gray-300 p-4">
          <p className="text-sm mb-3">Tem certeza que deseja cancelar este orçamento?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
              disabled={loading}
            >
              Não
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? "Cancelando..." : "Sim, cancelar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
