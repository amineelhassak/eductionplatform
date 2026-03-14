import { useEffect, useState } from "react";
import { AppLayout } from "../components";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../services/platform";
import { useAuth } from "../context/AuthContext";
import type { Conversation, Message } from "../types";

export function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePartner, setActivePartner] = useState<
    Conversation["partner"] | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .finally(() => setLoading(false));
  }, []);

  async function selectConversation(partner: Conversation["partner"]) {
    setActivePartner(partner);
    const msgs = await getMessages(partner.id);
    setMessages(msgs);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activePartner) return;
    const msg = await sendMessage(activePartner.id, input.trim());
    setMessages((prev) => [...prev, msg]);
    setInput("");
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

        <div
          className="flex border border-gray-200 rounded-xl overflow-hidden bg-white"
          style={{ height: "70vh" }}
        >
          {/* Sidebar */}
          <div className="w-72 border-r border-gray-200 overflow-y-auto shrink-0">
            {loading ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                Chargement…
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                Aucune conversation.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.partner.id}
                  onClick={() => selectConversation(c.partner)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition ${
                    activePartner?.id === c.partner.id ? "bg-brand-50" : ""
                  }`}
                >
                  {c.partner.avatar ? (
                    <img
                      src={c.partner.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                      {c.partner.name?.charAt(0) ?? "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {c.partner.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {c.lastMessage}
                    </p>
                  </div>
                  {!c.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-600 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {!activePartner ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Sélectionnez une conversation
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  {activePartner.avatar ? (
                    <img
                      src={activePartner.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
                      {activePartner.name?.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium text-gray-800">
                    {activePartner.name}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {messages.map((m) => {
                    const isMe = m.senderId === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                            isMe
                              ? "bg-brand-600 text-white rounded-br-sm"
                              : "bg-gray-100 text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSend}
                  className="p-3 border-t border-gray-200 flex gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écrire un message…"
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-brand-600 text-white text-sm rounded-full hover:bg-brand-700 transition">
                    Envoyer
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
