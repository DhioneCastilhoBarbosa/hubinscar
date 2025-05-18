import { Dialog } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../../services/api';
import { Installer } from '../installer';
import { toast } from 'sonner';



interface Props {
  isOpen: boolean;
  onClose: () => void;
  installer: Installer | null;
  sessionId: string | null;
}

export default function RequestQuoteModal({isOpen, onClose, installer, sessionId}:Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [aceite, setAceite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    
    const fileArray = Array.from(selectedFiles);
  
    const newFiles = fileArray
      .map(file => {
        const uniqueFile = new File([file], `${Date.now()}-${file.name}`, {
          type: file.type,
        });
  
        return {
          file: uniqueFile,
          preview: URL.createObjectURL(uniqueFile),
        };
      })
      .filter(newFile =>
        !files.some(existing => existing.file.name === newFile.file.name)
      );
  
    // Limitar o total a 2 imagens
    const totalAllowed = 2 - files.length;
    if (totalAllowed <= 0) {
      toast.info("Você só pode enviar no máximo 2 imagens.");
      return;
    }
  
    const limitedNewFiles = newFiles.slice(0, totalAllowed);
  
    setFiles(prev => [...prev, ...limitedNewFiles]);
  
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  
  

  const handleRemove = (name: string) => {
    setFiles(prev => {
      const toRemove = prev.find(f => f.file.name === name);
      if (toRemove) {
        URL.revokeObjectURL(toRemove.preview); // limpa da memória
      }
      return prev.filter(f => f.file.name !== name);
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!aceite) {
      toast.info("Você deve aceitar os termos para continuar.");
      return;
    }
    setIsSubmitting(true); // 🔄 Inicia o loading
  
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
  
    // Adiciona dados extras
    if (sessionId) formData.append("session_id", sessionId);
    if (installer?.id) formData.append("installer_id", installer.id);
    if (installer?.username || installer?.company_name) {
      formData.append("installer_name", installer.username || installer.company_name || "");
    }
  
    // Fotos (no máximo 2)
    files.slice(0, 2).forEach((f, i) => {
      formData.append(`photo${i + 1}`, f.file);
    });
  
    try {
      const response = await api.post("/api/v1/budget/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Orçamento enviado com sucesso:", response.data);
      toast.success("Orçamento enviado com sucesso! Aguarde nosso contato.");
      setFiles([]);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar orçamento. Tente novamente mais tarde.");
    } finally{
      setIsSubmitting(false); // 🔄 Para o loading
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      // Limpa arquivos
      setFiles([]);
      
      // Limpa aceite
      setAceite(false);
  
      // Limpa inputs (se quiser garantir manualmente)
      if (inputRef.current) inputRef.current.value = '';
      
      // Reseta o formulário via DOM
      const form = document.getElementById('quote-form') as HTMLFormElement | null;
      if (form) form.reset();
    }
  }, [isOpen]);
  

  return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 " aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 ">
          
        <Dialog.Panel className="bg-white max-h-screen overflow-y-auto  p-6 w-full max-w-3xl shadow-lg md:mt-16 mt-36 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">

            <Dialog.Title className="text-2xl font-bold mb-4 text-black">Solicitar Orçamento</Dialog.Title>

            <form
              id="quote-form" 
              className="space-y-4 text-black pb-[calc(5rem+env(safe-area-inset-bottom))]"
              onSubmit={handleSubmit} 
            >

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="name" type="text" placeholder="Nome" className="rounded px-3 py-2 outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black" />
                <input name="email" type="email" placeholder="E-mail" className=" rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
                <input name="phone" type="tel" placeholder="Telefone" className="rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
              </div>

              <div>
                <label className="block font-medium">Número de estações que deseja intalar</label>
                <input name="station_count" type="number" className="w-32 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
              </div>

              

              <div>
                <label className="block font-medium">Tipo de local</label>
                <select name="location_type" className="w-60  rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2">
                  <option>Residencial</option>
                  <option>Condomínio</option>
                  <option>Empresa</option>
                  <option>Estacionamento público</option>
                  <option>Outro</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Fotos do local</label>

                <label
                  htmlFor="upload"
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 inline-block"
                >
                  Selecionar imagem(s)
                </label>


                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  multiple
                  ref={inputRef}
                  onClick={() => {
                    if (inputRef.current) inputRef.current.value = '';
                  }}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {files.length > 0 && (
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map(({ file, preview }, index) => (
                      <li key={index} className="relative border rounded-lg overflow-hidden shadow">
                        <img
                          src={preview}
                          alt={file.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-1 right-1">
                          <button
                            type="button"
                            onClick={() => handleRemove(file.name)}
                            className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                          >
                            Remover
                          </button>
                        </div>
                        <div className="p-2 text-sm truncate">{file.name}</div>
                      </li>
                    ))}
                  </ul>
                )}


              </div>

              <div>
                <label className="block font-medium">Distância até o quadro de energia (m)</label>
                <input name="distance" type="number" className="w-32 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
              </div>

              <div>
                <label className="block font-medium">Conexão de rede disponível</label>
                <select name="network_type" className="w-60 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2">
                  <option>Wi-Fi</option>
                  <option>Cabo (Ethernet)</option>
                  <option>Nenhuma</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Estrutura de instalação</label>
                <select name="structure_type" className="w-60 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2">
                  <option>Parede</option>
                  <option>Poste</option>
                  <option>Totem existente</option>
                  <option>Ainda não sei</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Tipo de carregador</label>
                <select name="charger_type" className="w-60 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2">
                  <option>Portátil (tomada comum)</option>
                  <option>Wallbox (AC)</option>
                  <option>Carregador rápido (DC)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Potência disponível (kW)</label>
                <input name="power"type="number" className="w-60 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
                <label className="flex items-center mt-1">
                  <input type="checkbox" className="mr-2" /> Não sei informar
                </label>
              </div>

              <div>
                <label className="block font-medium mb-1">Deseja incluir proteção elétrica?</label>
                <label className="flex items-center"><input type="checkbox" name="protection" className="mr-2" /> Disjuntor exclusivo</label>
                <label className="flex items-center"><input type="checkbox" name="protection" className="mr-2" /> DPS</label>
                <label className="flex items-center"><input type="checkbox" name="protection" className="mr-2" /> DR</label>
              </div>

              <div>
                <label className="block font-medium">Observações</label>
                <textarea  name="notes" className="w-full  rounded outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black px-3 py-2" rows={3} />
              </div>

              <div>
          <label className="flex items-start space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
                className="mt-1"
              />
              <span>
                Li e concordo com os{" "}
                <a href="/termos-de-uso" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a href="/politica-de-privacidade" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade
                </a>.
              </span>
            </label>
          </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!aceite || isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </button>

              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    
  );
}
