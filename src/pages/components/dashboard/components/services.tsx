import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, BadgeDollarSign,
  Calendar,
  CalendarClock,
  CheckCheck,
  ClipboardList,
  Construction,
  Home,
  MapPin,
  Network,
  ShieldCheck,
  Zap,
  PlugZap,
  User2,
  FileText,
  Gauge,
  Camera,
  CreditCard} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../../services/api';
import React from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import CancelBudgetButton from './cancelBudgetButton';
import ConfirmServiceButton from './ConfirmServiceButton';
import { useRefreshBudgets } from './useRefreshBudgets';

interface Budget {
  id: number;
  user_id: string;
  session_id: string;
  installer_id: string;
  name: string;
  email: string;
  phone: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  complement?: string;

  station_count: number;
  location_type: string;
  photo1?: string;
  photo2?: string;
  distance: string;
  network_type: string;
  structure_type: string;
  charger_type: string;
  power: string;
  protection: string;
  notes: string;
  installer_name: string;
  value: number;
  status: string;
  execution_date: string | null;
  finish_date: string | null;
  payment_status: string;
  installer_confirm: boolean;
  client_confirm: boolean;
  created_at: string;
}

export interface BudgetWithTemp extends Budget {
  tempChanges?: {
    value?: number | '';
    execution_date?: string;
  };
}


const getStatusStyle = (status: string) => {
  const base = 'w-60 justify-start text-right';
  switch (status.toLowerCase()) {
    case 'concluido':
      return `${base} bg-green-900 text-green-300 border-green-500`;
    case 'cancelado':
      return `${base} bg-red-900 text-red-300 border-red-500`;
    case 'em andamento':
      return `${base} bg-yellow-900 text-yellow-300 border-yellow-500`;
    case 'aguardando orçamento':
      return `${base} bg-blue-900 text-blue-300 border-blue-500`;
    case 'aguardando pagamento':
      return `${base} bg-amber-700 text-white border-amber-500 text-center`;
    default:
      return base;
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'concluido':
      return <CheckCircle className="w-4 h-4 mr-2" />;
    case 'cancelado':
      return <XCircle className="w-4 h-4 mr-2" />;
    case 'em andamento':
      return <Clock className="w-4 h-4 mr-2" />;
    case 'aguardando orçamento':
      return <Clock className="w-4 h-4 mr-2" />;
    case 'aguardando pagamento':
      return <Clock className="w-4 h-4 mr-2" />;
    default:
      return null;
  }
};

export default function Services() {
  const itemsPerPage = 10;
  const [budgets, setBudgets] = useState<BudgetWithTemp[]>([]);
  const refreshBudgets = useRefreshBudgets(setBudgets);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const isCliente = () => {
    return localStorage.getItem("person") === "cliente";
  };

  const handleRealizarPagamento = async (service: Budget) => {
    const user_id = localStorage.getItem("ID");
    const fullName = localStorage.getItem("name") || "";

    const [first, ...rest] = fullName.trim().split(" ");
    const name = first || "-";
    const lastname = rest.length > 0 ? rest.join(" ") : "-";
  
    if (!user_id || !name || !lastname) {
      toast.error("Informações do usuário ausentes.");
      return;
    }
  
    try {
      const response = await api.post("https://api.eletrihub.com/criar-pagamento", {
        titulo: `Pagamento do orçamento ID=${service.id} - Instalação de carregador`,
        valor: service.value,
        name,
        lastname,
        user_id,
        id_budget: service.id.toString(),
      });
  
      const { url } = response.data;
  
      if (url) {
        window.open(url, "_blank"); // abre em nova aba
      } else {
        toast.error("Erro: URL de pagamento não recebida.");
      }
    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error);
      toast.error("Erro ao iniciar pagamento.");
    }
  };

  // Crie a função handleUpdateField para atualizar local e opcionalmente salvar na API
    const handleUpdateField = (id: number, field: keyof Budget, value: Budget[keyof Budget]) => {
      setBudgets(prev => prev.map(b => {
        if (b.id !== id) return b;
        return {
          ...b,
          tempChanges: {
            ...b.tempChanges,
            [field]: value,
          },
        };
      }));
      
    };

    const handleServicoRealizado = async (id: number) => {
      try {
        await api.put(`/api/v1/budget/confirm`, { id });
        toast.success("Serviço confirmado com sucesso!");
      } catch (err) {
        console.error(err);
        toast.error("Erro ao confirmar serviço.");
      }
    };

    const handleEnviarOrcamento = async (service: BudgetWithTemp) => {
      try {
        const value = service.tempChanges?.value ?? service.value;
        const rawExecutionDate = service.tempChanges?.execution_date ?? service.execution_date;
    
        if (!value || !rawExecutionDate) {
          toast.error("Preencha o valor e a data de início antes de enviar.");
          return;
        }
    
      // Divide a string "YYYY-MM-DD" em partes
      const [year, month, day] = rawExecutionDate.split("-");

      // Cria um Date no horário local ao meio-dia
      const executionDate = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0); // mês começa em 0

      // Converte para ISO (com fuso)
      const executionDateISO = executionDate.toISOString();

    
        // Atualiza status
        await api.put(`/api/v1/budget/${service.id}/status`, {
          status: "aguardando pagamento",
        });
    
        // Atualiza valor
        await api.put(`/api/v1/budget/${service.id}/value`, {
          value,
        });
    
        // Atualiza data de início com data/hora ISO
        await api.put(`/api/v1/budget/${service.id}/dates`, {
          execution_date: executionDateISO,
        });
    
        toast.success("Orçamento enviado com sucesso!");
        refreshBudgets();
      } catch (err) {
        console.error(err);
        toast.error("Erro ao enviar orçamento.");
      }
    };
    
      
  

  useEffect(() => {
    const user_id = localStorage.getItem("ID");
    const session_id = localStorage.getItem("session_id");
    const person = localStorage.getItem("person");
  
    if (!user_id) {
      setError("Usuário não identificado.");
      setLoading(false);
      return;
    }
  
    const linkAndFetch = async () => {
      try {
        if (session_id) {
          try {
            await api.put("/api/v1/budget/link", { user_id, session_id });
            localStorage.removeItem("session_id");
          } catch (linkError: unknown) {
            if (
              linkError instanceof AxiosError &&
              linkError.response?.status !== 409
            ) {
              throw linkError;
            }
  
            if (
              linkError instanceof AxiosError &&
              linkError.response?.status === 409
            ) {
              console.warn("Orçamentos já estavam vinculados.");
              localStorage.removeItem("session_id");
            } else {
              throw linkError;
            }
          }
        }
  
        // Busca condicional
        const param = person === "instalador" ? `installer_id=${user_id}` : `user_id=${user_id}`;
        const res = await api.get(`/api/v1/budget/?${param}`);
        setBudgets(res.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar seus orçamentos.");
      } finally {
        setLoading(false);
      }
    };
  
    linkAndFetch();
  }, []);
  
  

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

const filtered = budgets.filter((s) => {
  const searchTerm = search.toLowerCase();

  const matchSearch =
    s.id.toString().includes(searchTerm) ||
    (isCliente()
      ? s.installer_name?.toLowerCase().includes(searchTerm)
      : s.name?.toLowerCase().includes(searchTerm));

  const matchStatus = filterStatus
    ? s.status?.toLowerCase() === filterStatus.toLowerCase()
    : true;

  return matchSearch && matchStatus;
});


  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filtered.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="text-white text-center mt-8">🔄 Carregando seus orçamentos...</div>;
  }

  if (error || budgets.length === 0) {
    return (
      <div className="text-center text-white mt-8">
        <p className="text-lg font-semibold">😕 Nenhum orçamento encontrado</p>
        <p className="text-gray-400">Você ainda não solicitou nenhum orçamento. Comece agora mesmo!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-zinc-800 rounded-lg p-4 text-white w-full max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-4">
        <input
          type="text"
          placeholder={isCliente()?"Buscar por ID ou instalador...":"Buscar por ID ou cliente..."}
          className="px-2 py-1 rounded bg-zinc-700 text-white placeholder-gray-400 w-full md:w-56"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-2 py-1 rounded bg-zinc-700 text-white w-full md:w-52"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="Aguardando orçamento">Aguardando orçamento</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluido">Concluído</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto ">
          <thead>
            <tr className="text-gray-400 border-b border-zinc-600 ">
              <th className="text-left py-1 pl-3">ID</th>
              <th className="text-left py-1">{isCliente() ? "Instalador" :"Cliente"}</th>
              <th className="text-left py-1">Início</th>
              <th className="text-left py-1">Finalização</th>
              <th className="text-left py-1 w-62">Status</th>
              <th className="text-left py-1 w-60">Ação</th>
            </tr>
          </thead>
          <tbody>
          {currentServices.map((service) => {
            const isClienteValido = isCliente();
            const valorValido = Number(service.value) > 0;
            const isPago = service.payment_status === "pago";
            const desabilitado = isPago || !isClienteValido || !valorValido;

            return (
              <React.Fragment key={service.id}>
                <tr
                  className="border-b border-zinc-700 cursor-pointer hover:bg-zinc-700"
                  onClick={() => toggleRow(service.id)}
                >
                  <td className="py-3 pl-3">#{service.id}</td>
                  <td>{isCliente()? service.installer_name : service.name}</td>
                  <td>{service.execution_date ? new Date(service.execution_date).toLocaleDateString() : '-'}</td>
                  <td>{service.finish_date ? new Date(service.finish_date).toLocaleDateString() : '-'}</td>
                  <td className="text-left">
                    <span
                      className={`inline-flex items-center border rounded-lg px-3 py-2 text-sm font-medium ${getStatusStyle(
                        service.status
                      )}`}
                    >
                      {getStatusIcon(service.status)}
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      disabled={desabilitado}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRealizarPagamento(service);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 w-full justify-center border
                        ${isPago
                          ? "bg-zinc-800 text-green-500 border-green-500 cursor-not-allowed"
                          : isClienteValido && valorValido
                            ? "bg-green-600 hover:bg-green-700 text-white border-transparent cursor-pointer"
                            : "bg-zinc-600 text-zinc-400 border-transparent cursor-not-allowed"
                        }`}
                    >
                      <CreditCard
                        size={16}
                        className={isPago ? "text-green-500" : ""}
                      />
                      {isPago
                        ? "Pago"
                        : isClienteValido && valorValido
                          ? "Realizar pagamento"
                          : "Pagamento indisponível"}
                    </button>
                  </td>
                </tr>

                {expandedRows.includes(service.id) && (
                  <tr className="bg-zinc-900 text-gray-300">
                    <td colSpan={6} className="p-4 space-y-2">
                      {(service.photo1 || service.photo2) && (
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-start gap-2">
                            <Camera size={16} className="text-zinc-400" />
                            <span><strong>Fotos:</strong></span>
                          </div>
                          {[service.photo1, service.photo2].filter(Boolean).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Foto ${index + 1}`}
                              className="w-60 h-44 rounded-lg object-cover border border-zinc-600"
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-zinc-400" />
                        <span>
                          <strong>Endereço:</strong>{" "}
                          {`${service.street || ""}, ${service.number || ""} - ${service.neighborhood || ""}, ${service.city || ""} - ${service.state || ""}, CEP ${service.cep || ""}`}
                        </span>
                      </div>
                      {service.complement && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-zinc-400" />
                          <span><strong>Complemento:</strong> {service.complement}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-zinc-300 mt-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-zinc-400" />
                          <span><strong>Solicitação:</strong> {new Date(service.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BadgeDollarSign size={16} className="text-zinc-400" />
                          <span><strong>Valor:</strong> R$ {service.value.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User2 size={16} className="text-zinc-400" />
                          <span><strong>Instalador:</strong> {service.installer_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge size={16} className="text-zinc-400" />
                          <span><strong>Qtd. Estações:</strong> {service.station_count}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home size={16} className="text-zinc-400" />
                          <span><strong>Tipo de Local:</strong> {service.location_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-zinc-400" />
                          <span><strong>Distância:</strong> {service.distance}m</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Network size={16} className="text-zinc-400" />
                          <span><strong>Rede de dados:</strong> {service.network_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Construction size={16} className="text-zinc-400" />
                          <span><strong>Estrutura:</strong> {service.structure_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PlugZap size={16} className="text-zinc-400" />
                          <span><strong>Carregador:</strong> {service.charger_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap size={16} className="text-zinc-400" />
                          <span><strong>Potência:</strong> {service.power}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={16} className="text-zinc-400" />
                          <span><strong>Proteção:</strong> {service.protection}</span>
                        </div>
                        <div className="sm:col-span-2 flex items-start gap-2">
                          <FileText size={16} className="text-zinc-400 mt-1" />
                          <span><strong>Observações:</strong> {service.notes}</span>
                        </div>


                        <div className="flex flex-row justify-end items-end gap-4 mt-4 text-right w-full sm:col-span-2">
                          {!isCliente() && !isPago && (
                            <div className="flex gap-4 items-end">
                              <div className='flex flex-col  items-start gap-1'>
                                <label htmlFor="">Valor:(R$)</label>
                                <input
                                  type="number"
                                  value={service.tempChanges?.value ?? ''}
                                  onChange={(e) => handleUpdateField(service.id, "value", e.target.value === '' ? '' : parseFloat(e.target.value))}
                                  className="bg-zinc-800 text-white p-2 rounded border border-zinc-600 w-32"
                                  placeholder="Valor"
                                />
                              </div>
                              <div className='flex flex-col  items-start gap-1'>
                                <label htmlFor="">Data de início</label>
                                <input
                                  type="date"
                                  value={service.tempChanges?.execution_date ?? ''}
                                  onChange={(e) => handleUpdateField(service.id, "execution_date", e.target.value)}
                                  className="bg-zinc-800 text-white p-2 rounded border border-zinc-600 w-40"
                                />
                              </div>
                            </div>
                          )}

                          {!isCliente() && service.payment_status !== "pago" &&(
                            <button
                              onClick={() => handleEnviarOrcamento(service)}
                              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 border-blue-600 rounded-lg font-medium text-sm justify-center border transition-colors duration-200 w-40"
                              >
                              Enviar orçamento
                            </button>
                          )}

                          <div className="flex gap-4 items-end justify-end">
                            {service.status !== "concluido" && (

                                  <div className='w-36'>
                                  <CancelBudgetButton
                                    id={service.id}
                                    status={service.status} 
                                    onCancelSuccess={refreshBudgets}
                                  />
                                  </div>
                                  )
                            }
                            

                            {service.payment_status === "pago" && (
                              <ConfirmServiceButton
                              id={service.id}
                              isCliente={isCliente()}
                              clientConfirmed={service.client_confirm}
                              installerConfirmed={service.installer_confirm}
                              onConfirmSuccess={refreshBudgets}
                            
                            />
                            )}
                          </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}

          </tbody>
        </table>
      </div>

    {/* Cards para telas pequenas */}
    <div className="md:hidden flex flex-col gap-4">
        {currentServices.map((service) => {
          const isClienteValido = isCliente();
          const valorValido = Number(service.value) > 0;
          const isPago = service.payment_status === "pago";
          const desabilitado = isPago || !isClienteValido || !valorValido;

          const isExpanded = expandedRows.includes(service.id);

          return (
            <div key={service.id} className="bg-zinc-700 p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-1 gap-3 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <ClipboardList size={16} className="text-zinc-400" />
                  <span><strong>ID:</strong> #{service.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User2 size={16} className="text-zinc-400" />
                  <span><strong>{isCliente()?"Instalador:":"Cliente:"}</strong> {isCliente()?service.installer_name: service.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <span className={`inline-flex items-center border rounded-lg px-4 py-2 text-sm font-medium ${getStatusStyle(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <button
                    disabled={desabilitado}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRealizarPagamento(service);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 justify-center border
                      ${isPago
                        ? "bg-zinc-800 text-green-500 border-green-500 cursor-not-allowed"
                        : isClienteValido && valorValido
                          ? "bg-green-600 hover:bg-green-700 text-white border-transparent"
                          : "bg-zinc-600 text-zinc-400 border-transparent cursor-not-allowed"
                      }`}
                  >
                    <CreditCard size={16} className={isPago ? "text-green-500" : ""} />
                    {isPago ? "Pago" : isClienteValido && valorValido ? "Realizar pagamento" : "Pagamento indisponível"}
                  </button>

                  <CancelBudgetButton
                    id={service.id}
                    status={service.status}
                    onCancelSuccess={async () => {
                      try {
                        const user_id = localStorage.getItem("ID");
                        if (!user_id) return;
                        const res = await api.get(`/api/v1/budget/?user_id=${user_id}`);
                        setBudgets(res.data);
                      } catch (err) {
                        console.error(err);
                        toast.error("Erro ao atualizar lista de orçamentos.");
                      }
                    }}
                  />
                </div>

                <button
                  onClick={() => toggleRow(service.id)}
                  className="text-sm text-blue-400 mt-3 underline"
                >
                  {isExpanded ? "Ocultar detalhes" : "Mostrar detalhes"}
                </button>

                {isExpanded && (
                  <>
                    {(service.photo1 || service.photo2) && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <Camera size={16} className="text-zinc-400" />
                          <span><strong>Fotos:</strong></span>
                        </div>
                        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory px-1">
                          {[service.photo1, service.photo2].filter(Boolean).map((photo, index) => (
                            <div key={index} className="flex-shrink-0 snap-start">
                              <img
                                src={photo}
                                alt={`Foto ${index + 1}`}
                                className="w-72 h-52 rounded-lg object-cover border border-zinc-600 shadow-md"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-y-3 text-sm text-zinc-300 mt-2">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-zinc-400 mt-1" />
                        <span>
                          <strong>Endereço:</strong><br />
                          {`${service.street || ""}, ${service.number || ""} - ${service.neighborhood || ""}`}<br />
                          {`${service.city || ""} - ${service.state || ""}, CEP ${service.cep || ""}`}
                          {service.complement && <><br /><strong>Complemento:</strong> {service.complement}</>}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-zinc-400" />
                        <span><strong>Solicitado em:</strong> {new Date(service.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BadgeDollarSign size={16} className="text-zinc-400" />
                        <span><strong>Valor:</strong> R$ {service.value.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarClock size={16} className="text-zinc-400" />
                        <span><strong>Início:</strong> {service.execution_date ? new Date(service.execution_date).toLocaleDateString() : '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCheck size={16} className="text-zinc-400" />
                        <span><strong>Finalização:</strong> {service.finish_date ? new Date(service.finish_date).toLocaleDateString() : '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge size={16} className="text-zinc-400" />
                        <span><strong>Qtd. Estações:</strong> {service.station_count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-zinc-400" />
                        <span><strong>Tipo de Local:</strong> {service.location_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Network size={16} className="text-zinc-400" />
                        <span><strong>Tipo de rede:</strong> {service.network_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Construction size={16} className="text-zinc-400" />
                        <span><strong>Estrutura:</strong> {service.structure_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PlugZap size={16} className="text-zinc-400" />
                        <span><strong>Carregador:</strong> {service.charger_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-zinc-400" />
                        <span><strong>Potência:</strong> {service.power}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-zinc-400" />
                        <span><strong>Proteção:</strong> {service.protection}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText size={16} className="text-zinc-400 mt-1" />
                        <span><strong>Observações:</strong> {service.notes}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-end items-end gap-4 mt-4 text-right w-full sm:col-span-2">
                    {!isCliente() && service.payment_status !== "pago" && (
                        <div className="flex gap-4 items-end border border-zinc-600 p-2 rounded-lg w-full flex-wrap">
                          <div className="flex flex-col items-start gap-1 flex-1 min-w-[120px]">
                            <label htmlFor={`value-${service.id}`}>Valor (R$)</label>
                            <input
                                  type="number"
                                  value={service.tempChanges?.value ?? ''}
                                  onChange={(e) => handleUpdateField(service.id, "value", e.target.value === '' ? '' : parseFloat(e.target.value))}
                                  className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600 w-full h-10 appearance-none"
                                  placeholder="Valor"
                                />
                          </div>

                          <div className="flex flex-col items-start gap-1 flex-1 min-w-[120px]">
                            <label htmlFor={`date-${service.id}`}>Data de início</label>
                            <input
                                  type="date"
                                  value={service.tempChanges?.execution_date ?? ''}
                                  onChange={(e) => handleUpdateField(service.id, "execution_date", e.target.value)}
                                  className="bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600 w-full h-10 appearance-none"
                                />
                          </div>
                        </div>
                      )}

                          {!isCliente() && service.payment_status !== "pago" &&(
                          <button
                            onClick={() => handleEnviarOrcamento(service)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full"
                          >
                            Enviar orçamento
                          </button>
                          )}
                          {service.payment_status === "pago" && (
                              <ConfirmServiceButton
                              id={service.id}
                              isCliente={isCliente()}
                              clientConfirmed={service.client_confirm}
                              installerConfirmed={service.installer_confirm}
                              onConfirmSuccess={refreshBudgets}
                            
                            />
                            )}
                          </div>


                    {!isCliente() && service.payment_status === "pago" && (
                      <button
                        onClick={() => handleServicoRealizado(service.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                      Serviço realizado
                      </button>
                    )}

                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>



      <div className="flex justify-between items-center mt-6 text-sm text-gray-300">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-40"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-zinc-700 rounded disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </motion.div>
  );
}
