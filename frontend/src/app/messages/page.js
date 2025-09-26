"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchConversations(token);
  }, []);

  const fetchConversations = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/messages/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (data.success) {
        setConversations(data.data || []);
        if (data.data.length > 0) {
          selectConversation(data.data[0], token);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation, token) => {
    setSelectedConversation(conversation);
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${conversation._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (data.success) {
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedConversation._id,
          content: { text: newMessage },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...messages, data.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    onClick={() =>
                      selectConversation(
                        conversation,
                        localStorage.getItem("token")
                      )
                    }
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?._id === conversation._id
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-semibold text-indigo-600">
                          {conversation.user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">
                            {conversation.user.name}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white rounded-full text-xs px-2 py-1">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {conversations.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No conversations yet
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">
                      {selectedConversation.user.name}
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.senderId._id === selectedConversation._id
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                            message.senderId._id === selectedConversation._id
                              ? "bg-gray-100"
                              : "bg-indigo-100"
                          }`}
                        >
                          <p>{message.content.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={sendMessage} className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
