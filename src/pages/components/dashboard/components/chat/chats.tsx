import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import Sidebar from "./components/sidebar";
import Chat from "./components/chat";
import { motion } from "framer-motion";
import ImgAvatar from "../../../../../assets/avatar.jpeg";

interface Conversation {
  id: string; // Ex: `${budgetId}-${receiverId}`
  name: string;
  avatar: string;
  budgetId: number;
  receiverId: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  // Add other fields as needed based on your API response
}

export default function Chats() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const id = localStorage.getItem("ID");
      const tipo = localStorage.getItem("person");

      console.log("🔍 id:", id, "tipo:", tipo);

      if (!id || !tipo) {
        console.warn("ID ou tipo não encontrado");
        return;
      }

      try {
        const response = await api.get("/api/conversas-orcamentos", {
          params: { id, tipo },
        });

        console.log("✅ Status:", response.status);
        console.log("📦 Dados recebidos:", response.data);

        const data = response.data;

        interface DataItem {
          cliente: { id: string; username: string; photo?: string };
          instalador: { id: string; username: string; photo?: string };
          budget_id: number;
        }

        const mapped: Conversation[] = (data as DataItem[])
  .map((item) => {
    const user = tipo.toLowerCase() === "instalador" ? item.cliente : item.instalador;

    if (!user?.id) {
      console.warn("⚠️ Ignorando conversa sem user.id", item);
      return null;
    }

    return {
      id: `${item.budget_id}-${user.id}`,
      name: user.username || "Desconhecido",
      avatar: user.photo || ImgAvatar,
      budgetId: item.budget_id,
      receiverId: user.id,
    };
  })
  .filter(Boolean) as Conversation[];


        console.log("📊 Conversas mapeadas:", mapped);
        setConversations(mapped);
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "response" in error) {
          const err = error as { response?: { status?: number; data?: unknown } };
          console.error("❌ Erro ao buscar conversas:", err.response?.status, err.response?.data);
        } else {
          console.error("❌ Erro ao buscar conversas:", error);
        }
      }
    };

    fetchConversations();
  }, []);

  const handleSelectChat = async (id: number) => {
    setSelectedId(id);

    const chat = conversations.find((c) => c.budgetId === id);
    console.log("📞 Selecionando chat:", chat);

    const senderId = localStorage.getItem("ID");
    if (!chat || !senderId) return;

    try {
      const response = await api.get("/chat/history", {
        params: {
          sender_id: senderId,
          receiver_id: chat.receiverId,
        },
      });

      const data = response.data;
      console.log("💬 Histórico recebido:", data);

      const sorted = Array.isArray(data)
        ? data.sort((a: Message, b: Message) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        : [];

      setMessages(sorted);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      setMessages([]);
    }
  };

  const selectedChat = conversations.find((c) => c.budgetId === selectedId);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const showSidebar = !isMobile || selectedId === null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex h-full w-full bg-zinc-900 text-white rounded-lg overflow-hidden"
    >
      {showSidebar && (
        <div className="w-full md:w-1/3">
          <Sidebar
            chats={conversations.map((c) => ({
              id: c.budgetId,
              name: c.name,
              avatar: c.avatar,
              budgetId: c.budgetId,
            }))}
            onSelect={handleSelectChat}
            selectedId={selectedId}
          />
        </div>
      )}

      {selectedChat && (
        <div className="w-full md:w-2/3">
          <Chat
            chat={selectedChat}
            messages={messages}
            onBack={() => {
              setSelectedId(null);
              setMessages([]);
            }}
          />
        </div>
      )}

      {!selectedChat && !isMobile && (
        <div className="hidden md:flex flex-1 items-center justify-center text-zinc-100 text-xl">
          Selecione uma conversa
        </div>
      )}
    </motion.div>
  );
}
