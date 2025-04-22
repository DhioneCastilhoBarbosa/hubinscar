type Props = {
  message: {
    from: string;
    text: string;
    time: string;
  };
};

export default function Message({ message }: Props) {
  const isUser = message.from === "me";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-xs ${
          isUser ? "bg-zinc-700 text-white" : "bg-zinc-600 text-white"
        }`}
      >
        {message.text}
        <div className="text-xs text-zinc-400 mt-1 text-right">{message.time}</div>
      </div>
    </div>
  );
}
