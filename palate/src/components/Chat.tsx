import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatProps = {
  onClose: () => void;
};

export default function Chat({ onClose }: ChatProps) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-bold">Chat with Palate</h2>
            <p className="text-sm text-gray-500">
              Ask me what to cook
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg">👋 Hey!</p>
              <p className="mt-2">
                Tell me what you're in the mood for.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="What should I cook?"
            className="flex-1 border rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white px-5 rounded-full hover:bg-gray-800"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
