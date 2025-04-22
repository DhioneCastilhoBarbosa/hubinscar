/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  chats: any[];
  onSelect: (id: number) => void;
  selectedId: number | null;
};

export default function Sidebar({ chats, onSelect, selectedId }: Props) {
  return (
    <div className="w-full md:w-2/3 h-full bg-zinc-800 border-r border-zinc-700 overflow-y-auto rounded-l-lg">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelect(chat.id)}
          className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-700 ${
            selectedId === chat.id ? "bg-zinc-700" : ""
          }`}
        >
          <img src={chat.avatar} className="w-10 h-10 rounded-full" />
          <div className="overflow-hidden">
            <p className="font-bold">{chat.name}</p>
            <p className="text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-[250px] md:max-w-full">
              {chat.messages.at(-1)?.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
