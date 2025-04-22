import { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const generateRandomId = () => Math.floor(1000 + Math.random() * 9000);

const statuses = ['Em Andamento', 'Concluído', 'Cancelado'];

const allServices = Array.from({ length: 20 }, (_, i) => {
  const status = statuses[i % 3];
  return {
    id: generateRandomId(),
    type: i % 2 === 0 ? 'Instalação' : 'Manutenção',
    installer: `Instalador ${i + 1}`,
    start: i % 3 === 0 ? '' : `0${(i % 9) + 1}.03.2025`,
    end: i % 4 === 0 ? '' : `1${(i % 9) + 1}.03.2025`,
    status
  };
});

const getStatusStyle = (status: string) => {
  const base = 'w-full max-w-[10rem] justify-start';
  switch (status) {
    case 'Concluído':
      return `${base} bg-green-900 text-green-300 border-green-500`;
    case 'Cancelado':
      return `${base} bg-red-900 text-red-300 border-red-500`;
    case 'Em Andamento':
      return `${base} bg-yellow-900 text-yellow-300 border-yellow-500`;
    default:
      return base;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Concluído':
      return <CheckCircle className="w-4 h-4 mr-2" />;
    case 'Cancelado':
      return <XCircle className="w-4 h-4 mr-2" />;
    case 'Em Andamento':
      return <Clock className="w-4 h-4 mr-2" />;
    default:
      return null;
  }
};

// ... importações mantidas

export default function Services() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredServices = allServices.filter((s) => {
    const matchSearch =
      s.type.toLowerCase().includes(search.toLowerCase()) ||
      s.installer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? s.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} 
      className="bg-zinc-800 rounded-lg p-4 text-white w-full max-w-6xl mx-auto"
    >
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por tipo ou instalador..."
          className="px-2 py-1 rounded bg-zinc-700 text-white placeholder-gray-400 w-full md:w-56"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-2 py-1 rounded bg-zinc-700 text-white w-full md:w-44"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {/* Tabela para telas grandes */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-gray-400 border-b border-zinc-600">
              <th className="text-left py-1 pl-3">ID</th>
              <th className="text-left py-1">Tipo de Serviço</th>
              <th className="text-left py-1">Instalador</th>
              <th className="text-left py-1">Data Início</th>
              <th className="text-left py-1">Data Fim</th>
              <th className="text-left py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentServices.map((service) => (
              <tr key={service.id} className="border-b border-zinc-700">
                <td className="py-3 pl-3">{service.id}</td>
                <td>{service.type}</td>
                <td>{service.installer}</td>
                <td>{service.start || '-'}</td>
                <td>{service.end || '-'}</td>
                <td className="w-44">
                  <span
                    className={`inline-flex items-center border rounded-lg px-3 py-1 text-sm font-medium ${getStatusStyle(
                      service.status
                    )}`}
                  >
                    {getStatusIcon(service.status)}
                    {service.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards para telas pequenas */}
      <div className="md:hidden flex flex-col gap-4">
        {currentServices.map((service) => (
          <div key={service.id} className="bg-zinc-700 p-4 rounded-lg shadow-md">
            <div className="mb-2 text-sm text-gray-300">ID: <span className="text-white">{service.id}</span></div>
            <div className="mb-1">🔧 <strong>Tipo:</strong> {service.type}</div>
            <div className="mb-1">👷 <strong>Instalador:</strong> {service.installer}</div>
            <div className="mb-1">📅 <strong>Início:</strong> {service.start || '-'}</div>
            <div className="mb-1">📆 <strong>Fim:</strong> {service.end || '-'}</div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center border rounded-lg px-3 py-1 text-sm font-medium ${getStatusStyle(
                  service.status
                )}`}
              >
                {getStatusIcon(service.status)}
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
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
