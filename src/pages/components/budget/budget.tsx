import { ChevronLeft, ChevronRight, Search, Star } from 'lucide-react'
import Img from '../../../assets/profissionais.svg'
import { motion } from 'framer-motion'
import { Table } from './components/table/table'
import { TableRow } from './components/table/table-row'
import { TableCell } from './components/table/table-cell'
import { IconButton } from './components/icon-button'
import { useEffect, useState } from 'react'
import Footer from '../footer'
import RequestQuoteModal from './components/requestBudget/requestBudget'
import api from '../../../services/api'
import ImgAvatar from "../../../assets/avatar.jpeg"
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

export default function Budget() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedInstaller, setSelectedInstaller] = useState<Installer | null>(null);

  const handleOpenModal = (installer: Installer) => {
    

  // Define o instalador selecionado e abre o modal
    setSelectedInstaller(installer);
    setIsOpen(true);
  };

  const handleSearchByCep = async () => {
    try {
      setLoading(true);
  
      // 1. Busca endereço pelo CEP
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
  
      if (data.erro) {
        toast.error("CEP não encontrado.");
        setInstallers([]);
        return;
      }
  
      const enderecoCompleto = `${data.logradouro} ${data.bairro} ${data.localidade} ${data.uf} ${cep}`;
  
      // 2. Busca coordenadas com LocationIQ (substitua pela sua chave)
      const locationIqKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
      const geoRes = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${locationIqKey}&q=${encodeURIComponent(
          enderecoCompleto
        )}&country=Brazil&format=json`
      );
      const geoData = await geoRes.json();
  
      if (!geoData.length) {
        toast.error("Coordenadas não encontradas para este CEP. tente outro CEP.");
        setInstallers([]);
        return;
      }
  
      const lat = geoData[0].lat;
      const lon = geoData[0].lon;
  
      // 3. Busca instaladores próximos
      const installersRes = await api.get(`/user/public/installers/nearby?lat=${lat}&lng=${lon}`);
      if (Array.isArray(installersRes.data)) {
        setInstallers(installersRes.data);
       
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
  

  function calcularNotaFinal(instalador: {
    average_rating: number,
    total_services_accepted: number,
    services_not_executed: number
  }) {
    const { average_rating, total_services_accepted, services_not_executed } = instalador;
  
    const peso_avaliacao = 0.7;
    const peso_execucao = 0.3;
  
    let taxa_execucao = 1;
  
    if (total_services_accepted > 0) {
      taxa_execucao = (total_services_accepted - services_not_executed) / total_services_accepted;
    }
  
    const nota_final = (average_rating * peso_avaliacao + taxa_execucao * 5 * peso_execucao) / (peso_avaliacao + peso_execucao);
  
    return nota_final.toFixed(2); // Ex: "4.75"
  }
  

  useEffect(() => {
    const fetchInstallers = async () => {
      try {
        const response = await api.get('/user/public/installers');
    
        // Verifica se o retorno é um array válido
        if (Array.isArray(response.data)) {
          setInstallers(response.data);
          console.log('Instaladores:', response.data);
        } else {
          setInstallers([]);
          console.warn('Resposta da API não é um array:', response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar instaladores:', error);
        setInstallers([]); // segurança em caso de erro
      }
    };
    
  
    fetchInstallers();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-start w-full bg-gray-200 min-h-screen text-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-black pt-16 w-full relative h-96 md:h-96"
        >
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="w-full h-full bg-gray-300 animate-pulse"></div>
          )}

          {/* Imagem */}
          <img
            src={Img}
            alt="Imagem de Profissional"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          <div className="w-full flex flex-col items-center justify-center absolute top-1/2 md:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-2 md:gap-4 text-center mt-20 md:mt-44">
            <h1 className="text-white font-bold text-lg sm:text-2xl md:text-4xl">
              Encontre o profissional que você precisa
            </h1>
            <p className="text-white text-sm sm:text-lg md:text-xl mt-2">
              Digite seu CEP que encontraremos o mais próximo de você
            </p>

            <div className="flex sm:flex-row items-center justify-center gap-2 sm:gap-4 w-96 mb-8">
            <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="rounded-lg p-3 md:w-full sm:w-96 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Digite seu CEP"
              />

              <button
                className="flex flex-row gap-2 bg-red-500 py-3 px-6 rounded-lg text-white hover:bg-red-700 transition duration-300 border-1 border-red-500 hover:border-red-700"
                onClick={handleSearchByCep}
                disabled={loading}
              >
                <Search size={24} />
                {loading ? "Procurando..." : "Procurar"}
              </button>

            </div>
          </div>
        </motion.div>

        <div className="w-full h-full bg-gray-200 px-4 mt-2 mb-4 overflow-x-auto ">
          <Table className="w-full min-w-max bg-white">
            <thead>
              <tr className="border-b border-gray-100">
                <TableCell className="rounded-bl-md" colSpan={1}>
                {installers.length > 0
                    ? `Mostrando ${installers.length} profissional(is) encontrado(s)`
                    : ""}
                </TableCell>
                <TableCell className="text-right rounded-br-md" colSpan={4}>
                  <div className="inline-flex items-center gap-8">
                    <span>Página 1 de 1</span>
                    <div className="flex gap-3">
                      <IconButton transparent disabled>
                        <ChevronLeft className="size-4" />
                      </IconButton>
                      <IconButton transparent>
                        <ChevronRight className="size-4" />
                      </IconButton>
                    </div>
                  </div>
                </TableCell>
              </tr>
            </thead>
            <tbody>
            {installers.length > 0 ? (
                installers.map((installer: Installer) => (
                  <TableRow key={installer.id} className="border-b border-gray-100">
                    <TableCell className="text-gray-800 flex-1">
                      <div className="flex flex-row items-center gap-2 md:gap-8 w-full justify-center">
                        <img
                          src={installer.photo || ImgAvatar }
                          alt="Imagem do profissional"
                          className="rounded-full w-12 h-12"
                        />
                        <span>{installer.username?.trim() ? installer.username : installer.company_name}</span>

                      </div>
                    </TableCell>
                    <TableCell className="text-gray-800 flex-1">
                      {installer.role}
                    </TableCell>
                    <TableCell className="text-gray-800 flex-1">
                      Serviços realizados - <span className="bg-black text-white p-1 rounded-sm">{installer.total_services_accepted}</span>
                    </TableCell>
                    <TableCell className="text-gray-800 flex-1">
                      <div className="flex flex-row items-center gap-2">
                        <Star className="text-yellow-500" size={18} />
                        <span>{calcularNotaFinal(installer)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-800 flex-1">
                      <div className="w-full flex flex-row items-center justify-center gap-2">
                        <button
                          className="bg-sky-600 text-white w-44 h-8 rounded-lg hover:cursor-pointer hover:bg-sky-500"
                          onClick={() => handleOpenModal(installer)}

                        >
                          Solicitar orçamento
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-600">
                    Nenhum profissional encontrado no momento.
                  </TableCell>
                </tr>
              )}

            </tbody>
          </Table>
        </div>

        <div className="w-full mt-auto">
          <Footer />
        </div>
      </div>
      <RequestQuoteModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        installer={selectedInstaller} 
      />
    </>
  );
}
