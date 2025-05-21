import { useState } from "react";
import { toast } from "sonner";
import api from "../../../../services/api";

interface ConfirmServiceButtonProps {
  id: number;
  isCliente: boolean;
  clientConfirmed?: boolean;
  installerConfirmed?: boolean;
  onConfirmSuccess?: () => void;
}

export default function ConfirmServiceButton({
  id,
  isCliente,
  clientConfirmed = false,
  installerConfirmed = false,
  onConfirmSuccess,
}: ConfirmServiceButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const alreadyConfirmed = isCliente ? clientConfirmed : installerConfirmed;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload = isCliente
        ? { client_confirm: true }
        : { installer_confirm: true };
  
      // Confirmação de serviço
      const res = await api.put(`/api/v1/budget/${id}/confirm`, payload);
  
      if (res.status === 200) {
        // Se for cliente, atualiza o status para "concluido"
        if (isCliente) {
          await api.put(`/api/v1/budget/${id}/status`, {
            status: "concluido",
          });
        }
  
        // Atualiza a data de finalização para ambos
        const today = new Date();
        const finishDate = today.toISOString().split("T")[0]; // "yyyy-mm-dd"
  
        await api.put(`/api/v1/budget/${id}/dates`, {
          finish_date: finishDate,
        });
      }
  
      toast.success("Serviço confirmado com sucesso.");
      setConfirmOpen(false);
      if (onConfirmSuccess) onConfirmSuccess(); // callback para atualizar a lista
    } catch (err) {
      console.error(err);
      toast.error("Erro ao confirmar serviço.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  return (
    <div className="relative inline-block text-left w-full">
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={alreadyConfirmed}
        className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm justify-center border transition-colors duration-200
          ${alreadyConfirmed
            ? "bg-zinc-600 text-zinc-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white border-transparent"}`}
      >
        {alreadyConfirmed ? "Serviço confirmado" : "Confirmar serviço"}
      </button>

      {confirmOpen && (
        <div className="absolute z-10 right-0 mt-2 w-64 bg-white text-black rounded shadow-lg border border-gray-300 p-4">
          <p className="text-sm mb-3">Tem certeza que deseja confirmar este serviço como realizado?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
              disabled={loading}
            >
              Não
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? "Confirmando..." : "Sim, confirmar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
