import { Search, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import RequestQuoteModal from "./components/requestBudget"
import api from '../../../../../services/api'
import ImgAvatar from  "../../../../../assets/avatar.jpeg"
import { toast } from 'sonner'

interface Installer {
  id: string;
  photo?: string;
  username?: string;
  company_name?: string;
  role?: string;
  total_services_accepted: number;
  average_rating: number;
  services_not_executed: number;
}

export default function Installer() {
  const [isOpen, setIsOpen] = useState(false);
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedInstaller, setSelectedInstaller] = useState<Installer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(installers.length / itemsPerPage);
  const displayedInstallers = installers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenModal = (installer: Installer) => {
    setSelectedInstaller(installer);
    setIsOpen(true);
  };

  const handleSearchByCep = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast.error("CEP não encontrado.");
        setInstallers([]);
        return;
      }
      const enderecoCompleto = `${data.logradouro} ${data.bairro} ${data.localidade} ${data.uf} ${cep}`;
      const locationIqKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
      const geoRes = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${locationIqKey}&q=${encodeURIComponent(enderecoCompleto)}&country=Brazil&format=json`
      );
      const geoData = await geoRes.json();
      if (!geoData.length) {
        toast.error("Coordenadas não encontradas para este CEP. Tente outro.");
        setInstallers([]);
        return;
      }
      const lat = geoData[0].lat;
      const lon = geoData[0].lon;
      const installersRes = await api.get(`/user/public/installers/nearby?lat=${lat}&lng=${lon}`);
      if (Array.isArray(installersRes.data)) {
        setInstallers(installersRes.data);
        setCurrentPage(1);
      } else {
        setInstallers([]);
      }
    } catch (error) {
      console.error("Erro ao buscar instaladores por CEP:", error);
      setInstallers([]);
    } finally {
      setLoading(false);
    }
  };

  function calcularNotaFinal(instalador: Installer) {
    const { average_rating, total_services_accepted, services_not_executed } = instalador;
    const peso_avaliacao = 0.7;
    const peso_execucao = 0.3;
    let taxa_execucao = 1;
    if (total_services_accepted > 0) {
      taxa_execucao = (total_services_accepted - services_not_executed) / total_services_accepted;
    }
    const nota_final = (average_rating * peso_avaliacao + taxa_execucao * 5 * peso_execucao) / (peso_avaliacao + peso_execucao);
    return nota_final.toFixed(2);
  }

  useEffect(() => {
    const fetchInstallers = async () => {
      try {
        const response = await api.get('/user/public/installers');
        if (Array.isArray(response.data)) {
          setInstallers(response.data);
        } else {
          setInstallers([]);
        }
      } catch (error) {
        console.error('Erro ao buscar instaladores:', error);
        setInstallers([]);
      }
    };
    fetchInstallers();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-zinc-900 text-white overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-6xl mx-auto px-4 py-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Encontre um profissional</h1>
        <p className="text-gray-400 text-center mb-4 text-sm">Digite o CEP para localizar os instaladores mais próximos</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-6 w-full">
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="Digite seu CEP"
            className="rounded-md px-4 py-2 w-full bg-zinc-800 text-white border border-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <button
            onClick={handleSearchByCep}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full sm:w-auto transition-colors duration-200 text-sm"
          >
            <Search size={18} />
            <span>{loading ? "Buscando..." : "Buscar"}</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[600px] bg-zinc-800 border border-zinc-700 text-sm">
            <thead className="bg-zinc-700">
              <tr>
                <th className="py-2 px-3 text-left">Profissional</th>
                <th className="py-2 px-3 text-left">Função</th>
                <th className="py-2 px-3 text-left">Serviços</th>
                <th className="py-2 px-3 text-left">Nota</th>
                <th className="py-2 px-3 text-left">Ação</th>
              </tr>
            </thead>
            <tbody>
              {displayedInstallers.length > 0 ? displayedInstallers.map(installer => (
                <tr key={installer.id} className="border-t border-zinc-700">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <img src={installer.photo || ImgAvatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                      <span>{installer.username || installer.company_name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">{installer.role}</td>
                  <td className="py-2 px-3">{installer.total_services_accepted}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400" size={16} />
                      {calcularNotaFinal(installer)}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleOpenModal(installer)}
                      className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Solicitar orçamento
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    Nenhum profissional encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {installers.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-6 text-sm text-gray-300">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-zinc-700 px-3 py-1 rounded disabled:opacity-40"
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages} — Total: {installers.length}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-zinc-700 px-3 py-1 rounded disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
      </motion.div>

      <RequestQuoteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        installer={selectedInstaller}
      />
    </div>
  )
}
