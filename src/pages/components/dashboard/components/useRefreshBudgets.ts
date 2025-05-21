import { useCallback } from "react";
import api from "../../../../services/api";
import { toast } from "sonner";
import { BudgetWithTemp } from "../components/services"; // ajuste o caminho se necessário

export function useRefreshBudgets(setBudgets: React.Dispatch<React.SetStateAction<BudgetWithTemp[]>>) {
  const refreshBudgets = useCallback(async () => {
    try {
      const user_id = localStorage.getItem("ID");
      if (!user_id) return;

      const param = localStorage.getItem("person") === "instalador"
        ? `installer_id=${user_id}`
        : `user_id=${user_id}`;

      const res = await api.get(`/api/v1/budget/?${param}`);
      setBudgets(res.data as BudgetWithTemp[]); // forçando tipagem correta
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar lista de orçamentos.");
    }
  }, [setBudgets]);

  return refreshBudgets;
}
