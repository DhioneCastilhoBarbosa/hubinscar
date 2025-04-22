import { useState } from "react";
import { conversations } from "./components/conversations";
import Sidebar from "./components/sidebar";
import Chat from "./components/chat";
import { motion } from "framer-motion";

export default function Chats() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedChat = conversations.find(c => c.id === selectedId);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const showSidebar = !isMobile || selectedId === null;

  return (
    <motion.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      transition={{ duration: 1 }} 
      className="flex h-full w-full bg-zinc-900 text-white rounded-lg overflow-hidden"
    >
      {showSidebar && (
        <div className="w-full md:w-1/3">
          <Sidebar chats={conversations} onSelect={setSelectedId} selectedId={selectedId} />
        </div>
      )}

      {selectedChat && (
        <div className="w-full md:w-2/3">
          <Chat chat={selectedChat} onBack={() => setSelectedId(null)} />
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
