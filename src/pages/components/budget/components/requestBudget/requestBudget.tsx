import { Dialog } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../../services/api';
import { Installer } from '../installer';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  installer: Installer | null;
 
}

export default function RequestQuoteModal({isOpen, onClose, installer,}:Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [aceite, setAceite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDataState, setFormDataState] = useState<{ power: string }>({
    power: "",
  });
  
  const [unknownPower, setUnknownPower] = useState(false);
  
  
  const [addressData, setAddressData] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: ""
  });
  
  


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
    // Verifica se já existe session_id
    let sessionId = localStorage.getItem('session_id');

    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('session_id', sessionId);
      console.log('🔐 Nova session_id criada:', sessionId);
    } else {
      console.log('🔐 session_id existente:', sessionId);
    }
  
    const form = e.target as HTMLFormElement;
    const formData = new FormData();

    // Preenche manualmente todos os campos visíveis do formulário
    new FormData(form).forEach((value, key) => {
      if (key !== "protection") {
        formData.append(key, value);
      }
    });

    formData.append("power", formDataState.power.replace(",", "."));


    // Captura múltiplos checkboxes marcados
    const protections = Array.from(
    form.querySelectorAll('input[name="protection"]:checked')
          ).map((input) => (input as HTMLInputElement).value);

    const protectionString = protections.join(", ");
    formData.append("protection", protectionString);




    // Adiciona dados extras
    if (sessionId) formData.append("session_id", sessionId);
    if (installer?.id) formData.append("installer_id", installer.id);
    if (installer?.username || installer?.company_name) {
      formData.append("installer_name", installer.username || installer.company_name || "");
    }
    formData.append("cep", addressData.cep);
    formData.append("street", addressData.street);
    formData.append("number", addressData.number);
    formData.append("neighborhood", addressData.neighborhood);
    formData.append("city", addressData.city);
    formData.append("state", addressData.state);
    formData.append("complement", addressData.complement);

  
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
      toast.success("Orçamento enviado com sucesso! Realize o login para acompanhá-lo.", {
        duration: Infinity,
        action: {
          label: "Fechar",
          onClick: () => toast.dismiss(),
        },
      });
      
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
    const fetchAddress = async () => {
      const cep = addressData.cep.replace(/\D/g, "");
      if (cep.length !== 8) return;
  
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
  
        if (data.erro) {
          toast.error("CEP não encontrado.");
          return;
        }
  
        setAddressData((prev) => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
          complement: data.complemento || ""
        }));
      } catch (err) {
        console.error("Erro ao buscar o CEP:", err);
        toast.error("Erro ao buscar o CEP.",);
      }
    };
  
    if (addressData.cep) fetchAddress();
  }, [addressData.cep]);
  
  
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
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-start justify-center pt-10 p-4 overflow-y-auto">
        <Dialog.Panel className="bg-zinc-900 text-white max-h-[90vh] overflow-y-auto p-6 w-full max-w-3xl rounded-xl shadow-lg">
          <Dialog.Title className="text-2xl font-bold mb-4">Solicitar Orçamento</Dialog.Title>
          <form id="quote-form" className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <input name="name" type="text" placeholder="Nome" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Email</label>
              <input name="email" type="email" placeholder="E-mail" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Telefone</label>
              <input name="phone" type="tel" placeholder="Telefone" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">CEP</label>
              <input name="cep" type="text" placeholder="CEP" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" value={addressData.cep} onChange={(e) => setAddressData({ ...addressData, cep: e.target.value })} required />
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">Rua</label>
                <input name="street" placeholder="Rua" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" value={addressData.street} onChange={(e) => setAddressData({ ...addressData, street: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Número</label>
              <input name="number" placeholder="Número" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" value={addressData.number} onChange={(e) => setAddressData({ ...addressData, number: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Bairo</label>
              <input name="neighborhood" placeholder="Bairro" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" value={addressData.neighborhood} onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Cidade</label>
              <input name="city" placeholder="Cidade" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Estado</label>
              <select name="state" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" value={addressData.state} onChange={(e) => setAddressData({ ...addressData, state: e.target.value })} required>
                <option value="">Estado</option>
                {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Complemento</label>
              <input name="complement" placeholder="Complemento" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white" value={addressData.complement} onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium">Qtd. estações</label>
                <input name="station_count" type="number" placeholder="Qtd. estações" className=" p-2 rounded border border-zinc-600 bg-zinc-800 text-white w-40" min={1} required />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">Tipo de local</label>
              <select name="location_type" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white w-60" required>
                <option>Residencial</option>
                <option>Condomínio</option>
                <option>Empresa</option>
                <option>Estacionamento público</option>
                <option>Outro</option>
              </select>
            </div>
  
            <div>
              <label className="block font-medium mb-1">Fotos do local</label>
              <label htmlFor="upload" className="cursor-pointer bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 inline-block">Selecionar imagem(s)</label>
              <input id="upload" type="file" accept="image/*" multiple ref={inputRef} onChange={handleFileChange} className="hidden" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {files.map(({ file, preview }) => (
                  <div key={file.name} className="relative">
                    <img src={preview} alt={file.name} className="w-full h-40 object-cover rounded" />
                    <button onClick={() => handleRemove(file.name)} className="absolute top-2 right-2 text-xs bg-red-600 px-2 py-1 rounded">Remover</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">Distância ate o quadro (m)</label>
              <input name="distance" type="number" placeholder="Distância até o quadro (m)" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white w-60" min={1} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">Conexão de rede disponível</label>
              <select name="network_type" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white w-60">
                <option>Wi-Fi</option>
                <option>Cabo (Ethernet)</option>
                <option>Nenhuma</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">Estrutura de instalação</label>
            <select name="structure_type" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white w-60">
              <option>Parede</option>
              <option>Poste</option>
              <option>Totem existente</option>
              <option>Ainda não sei</option>
            </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">Tipo de carregador</label>
              <select name="charger_type" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white w-60">
                <option>Portátil (tomada comum)</option>
                <option>Wallbox (AC)</option>
                <option>Carregador rápido (DC)</option>
              </select>
            </div>
  
            <div>
              <label className="block font-medium mb-1">Potência do carregador</label>
              <input
                name="power"
                type="text"
                inputMode="decimal"
                placeholder="Potência (kW)"
                className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white w-60"
                value={formDataState.power}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  if (/^\d*\.?\d*$/.test(raw)) {
                    setFormDataState({ ...formDataState, power: e.target.value });
                  }
                }}
                disabled={unknownPower}
                required
              />
              <label className="inline-flex items-center mt-2 ml-2">
                <input
                  type="checkbox"
                  checked={unknownPower}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUnknownPower(checked);
                    setFormDataState({ power: checked ? "Não informado" : "" });
                  }}
                  className="mr-2"
                />
                Não sei informar
              </label>
            </div>
  
            <div className="space-y-2">
              <label className="block font-medium">Deseja instalar proteções?</label>
              <label className="flex items-center">
                <input type="checkbox" name="protection" value="Disjuntor exclusivo" className="mr-2" />
                Disjuntor exclusivo
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="protection" value="DPS" className="mr-2" />
                DPS
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="protection" value="DR" className="mr-2" />
                DR
              </label>
            </div>
  
            <textarea name="notes" placeholder="Observações" className="p-2 rounded border border-zinc-600 bg-zinc-800 text-white w-full" rows={3} />
  
            <label className="flex items-start space-x-2 text-sm">
              <input
                type="checkbox"
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
                className="mt-1"
              />
              <span>
                Li e concordo com os <a href="/termos-de-uso" target="_blank" className="underline text-blue-400">Termos de Uso</a> e a <a href="/politica-de-privacidade" target="_blank" className="underline text-blue-400">Política de Privacidade</a>.
              </span>
            </label>
  
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-red-600 hover:bg-red-500">Cancelar</button>
              <button type="submit" disabled={!aceite || isSubmitting} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700">
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
