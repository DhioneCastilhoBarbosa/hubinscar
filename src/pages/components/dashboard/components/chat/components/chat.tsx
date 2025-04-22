/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  chat: any;
  onBack: () => void;
};

export default function Chat({ chat, onBack }: Props) {
  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* Header do chat */}
      <div className="flex items-center gap-3 border-b border-zinc-700 pb-4 mb-4">
        {/* Botão de voltar só no mobile */}
        <button
          onClick={onBack}
          className="md:hidden text-zinc-400 hover:text-white"
        >
          ←
        </button>

        <img src={chat.avatar} className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-lg font-semibold">{chat.name}</p>
          <p className="text-sm text-green-400">Online</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {chat.messages.map((msg: any, idx: number) => (
          <div key={idx} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-xl max-w-[80%] ${msg.from === "me" ? "bg-zinc-700" : "bg-zinc-600"}`}>
              <p>{msg.text}</p>
              <div className="text-xs text-zinc-400 mt-1 text-right">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Campo de mensagem */}
      <input
        type="text"
        placeholder="Digite sua mensagem"
        className="w-full px-4 py-3 rounded-full bg-zinc-800 text-white outline-none"
      />
    </div>
  );
}
