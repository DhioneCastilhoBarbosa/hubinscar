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

interface Budget {
  id: number;
  user_id: string;
  session_id: string;
  installer_id: string;
  name: string;
  email: string;
  phone: string;
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
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const isCliente = () => {
    return localStorage.getItem("person") === "cliente";
  };
  

  useEffect(() => {
    const user_id = localStorage.getItem("ID");
    const session_id = localStorage.getItem("session_id");
  
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
              // erro inesperado que não é do Axios
              throw linkError;
            }
          }
        }
  
        // Sempre busca os orçamentos
        const res = await api.get(`/api/v1/budget/?user_id=${user_id}`);
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
    const matchSearch =
      s.id.toString().includes(search.toLowerCase()) ||
      s.installer_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? s.status?.toLowerCase() === filterStatus.toLowerCase() : true;
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
          placeholder="Buscar por ID ou instalador..."
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
          <option value="aguardando orçamento">aguardando orçamento</option>
          <option value="em andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto ">
          <thead>
            <tr className="text-gray-400 border-b border-zinc-600 ">
              <th className="text-left py-1 pl-3">ID</th>
              <th className="text-left py-1">Instalador</th>
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
                  <td>{service.installer_name}</td>
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
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 w-full justify-center border
                        ${isPago
                          ? "bg-zinc-800 text-green-500 border-green-500 cursor-not-allowed"
                          : isClienteValido && valorValido
                            ? "bg-green-600 hover:bg-green-700 text-white border-transparent"
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
        {currentServices.map((service) => (
          <div key={service.id} className="bg-zinc-700 p-4 rounded-lg shadow-md">
            
           {/* Carrossel de fotos - mobile */}
            {(service.photo1 || service.photo2) && (
              <div className="mb-4">
                <div className="flex items-center gap-2 ">
                    <Camera size={16} className="text-zinc-400" />
                    <span><strong>Fotos:</strong></span>
                  </div>
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory px-1">
                  {[service.photo1, service.photo2].filter(Boolean).map((photo, index) => (
                    <div key={index} className="flex-shrink-0 snap-start">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-64 h-40 rounded-lg object-cover border border-zinc-600 shadow-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <ClipboardList size={16} className="text-zinc-400" />
                <span><strong>ID:</strong> #{service.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <User2 size={16} className="text-zinc-400" />
                <span><strong>Instalador:</strong> {service.installer_name}</span>
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
                <Home size={16} className="text-zinc-400" />
                <span><strong>Tipo de Local:</strong> {service.location_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-zinc-400" />
                <span><strong>Distância:</strong> {service.distance}m</span>
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
                <span><strong>Tipo de Carregador:</strong> {service.charger_type}</span>
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
            </div>


            <div className="mt-2">
              <span
                className={`inline-flex items-center border rounded-lg px-4 py-2 text-sm font-medium
                  ${getStatusStyle(service.status)}`}
              >
                {getStatusIcon(service.status)}
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
            </div>

            <div className="mt-4">
            {(() => {
                const isClienteValido = isCliente();
                const valorValido = Number(service.value) > 0;
                const isPago = service.payment_status === "pago";
                const desabilitado = isPago || !isClienteValido || !valorValido;

                return (
                  <button
                    disabled={desabilitado}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 w-full justify-center border
                      ${isPago
                        ? "bg-zinc-800 text-green-500 border-green-500 cursor-not-allowed"
                        : isClienteValido && valorValido
                          ? "bg-green-600 hover:bg-green-700 text-white border-transparent"
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
                );
              })()}

            </div>
          </div>
        ))}
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
