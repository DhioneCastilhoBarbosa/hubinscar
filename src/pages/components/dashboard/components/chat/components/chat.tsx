import { useEffect, useRef, useState } from "react";

type ChatType = {
  avatar: string;
  name: string;
  receiverId: string;
};

type MessageType = {
  sender_id: string;
  content: string;
  created_at: string | number | Date;
};

type Props = {
  chat: ChatType;
  messages: MessageType[];
  onBack: () => void;
};

export default function Chat({ chat, messages: initialMessages, onBack }: Props) {
  const userId = localStorage.getItem("ID") || "";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Atualiza mensagens quando o histórico mudar
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Conecta no WebSocket
  useEffect(() => {
    const ws = new WebSocket(`wss://api-chat-service.eletrihub.com/ws?id=${userId}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("🔌 WebSocket conectado");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📥 Mensagem recebida:", data);

      if (data.type === "message") {
        setMessages((prev) => [...prev, data]);
      }
    };
    ws.onerror = (error) => console.error("❌ Erro WebSocket:", error);
    ws.onclose = () => console.log("🔌 WebSocket desconectado");

    return () => ws.close();
  }, [userId]);

  // Rola automaticamente para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Envia mensagem
  const sendMessage = () => {
    if (!message.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const msgData = {
      sender_id: userId,
      receiver_id: chat.receiverId,
      content: message.trim(),
      type: "message",
    };

    wsRef.current.send(JSON.stringify(msgData));
    console.log("📤 Mensagem enviada:", msgData);

    setMessages((prev) => [...prev, { ...msgData, created_at: new Date().toISOString() }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-700 pb-4 mb-4">
        <button onClick={onBack} className="md:hidden text-zinc-400 hover:text-white">←</button>
        <img src={chat.avatar} className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-lg font-semibold">{chat.name}</p>
          <p className="text-sm text-green-400">Online</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[80%] ${
                msg.sender_id === userId ? "bg-zinc-700" : "bg-zinc-600"
              }`}
            >
              <p>{msg.content}</p>
              <div className="text-xs text-zinc-400 mt-1 text-right">
               {msg.created_at
                ? new Date(msg.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date().toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </div>
            </div>
          </div>
        ))}
        {/* Elemento invisível no final da lista */}
        <div ref={messagesEndRef} />
      </div>

      {/* Campo de mensagem */}
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem"
          className="flex-1 px-4 py-3 rounded-full bg-zinc-800 text-white outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-3 bg-green-600 rounded-full text-white hover:bg-green-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
