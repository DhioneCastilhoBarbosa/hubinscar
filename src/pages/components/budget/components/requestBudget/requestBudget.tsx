import { Dialog } from '@headlessui/react';
import { useRef, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestQuoteModal({isOpen, onClose}:Props) {

  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);

      // Evita duplicatas
      const uniqueFiles = fileArray.filter(
        newFile => !files.some(file => file.name === newFile.name)
      );

      setFiles(prev => [...prev, ...uniqueFiles]);

      // Limpa o input para permitir re-selecionar o mesmo arquivo depois
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (name: string) => {
    setFiles(prev => prev.filter(file => file.name !== name));
  };
  

  return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          
          <Dialog.Panel className="bg-white max-h-screen overflow-y-auto rounded-2xl p-6 w-full max-w-3xl shadow-lg">
            <Dialog.Title className="text-2xl font-bold mb-4 text-black">Solicitar Orçamento</Dialog.Title>

            <form className="space-y-4 text-black">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Nome" className="rounded px-3 py-2 outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black" />
                <input type="email" placeholder="E-mail" className=" rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
                <input type="tel" placeholder="Telefone" className="rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
              </div>

              <div>
                <label className="block font-medium">Número de estações que deseja intalar</label>
                <input type="number" className="w-32 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
              </div>

              

              <div>
                <label className="block font-medium">Tipo de local</label>
                <select className="w-60  rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2">
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
                  onChange={handleFileChange}
                  className="hidden"
                />

                {files.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-700 space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <button
                          onClick={() => handleRemove(file.name)}
                          className="text-red-500 hover:text-red-700 text-sm ml-2 pl-3"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block font-medium">Distância até o quadro de energia (m)</label>
                <input type="number" className="w-32 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
              </div>

              <div>
                <label className="block font-medium">Conexão de rede disponível</label>
                <select className="w-60 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2">
                  <option>Wi-Fi</option>
                  <option>Cabo (Ethernet)</option>
                  <option>Nenhuma</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Estrutura de instalação</label>
                <select className="w-60 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2">
                  <option>Parede</option>
                  <option>Poste</option>
                  <option>Totem existente</option>
                  <option>Ainda não sei</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Tipo de carregador</label>
                <select className="w-60 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2">
                  <option>Portátil (tomada comum)</option>
                  <option>Wallbox (AC)</option>
                  <option>Carregador rápido (DC)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Potência disponível (kW)</label>
                <input type="number" className="w-60 rounded outline-1 outline-gray-400 focus-within:outline-2 focus-within:outline-black px-3 py-2" />
                <label className="flex items-center mt-1">
                  <input type="checkbox" className="mr-2" /> Não sei informar
                </label>
              </div>

              <div>
                <label className="block font-medium mb-1">Deseja incluir proteção elétrica?</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2" /> Disjuntor exclusivo</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2" /> DPS</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2" /> DR</label>
              </div>

              <div>
                <label className="block font-medium">Observações</label>
                <textarea className="w-full  rounded outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-black px-3 py-2" rows={3} />
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
                  className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-700 transition"
                >
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    
  );
}
