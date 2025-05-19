// Updated src/pages/aiChat.jsx
import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { AiChatLogo } from "../assets";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "../services/api";

const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setFetchingHistory(true);
        const response = await axios.get("/api/chat/history");
        if (response.data && response.data.status === "success") {
          setMessages(response.data.data || []);
        }
      } catch (error) {
        console.error("Chat history fetch error:", error);
      } finally {
        setFetchingHistory(false);
      }
    };

    fetchChatHistory();
  }, []);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  // Animated typing effect for AI responses
  const typeMessage = (fullText) => {
    let index = 0;
    setTypingMessage("");
    const interval = setInterval(() => {
      setTypingMessage((prev) => prev + fullText[index - 1]);
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { text: fullText, isUser: false }]);
        setTypingMessage("");
        // Save message to history
        saveChatMessage(fullText, false);
      }
    }, 1); // typing speed
  };

  // Save message to history in database
  const saveChatMessage = async (text, isUser) => {
    try {
      await axios.post("/api/chat/message", {
        text,
        isUser,
      });
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to history
    await saveChatMessage(input, true);

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat/ai-response", {
        message: input,
      });

      if (response.data && response.data.status === "success") {
        typeMessage(response.data.response);
      } else {
        typeMessage("Uzr, javob topilmadi. Iltimos, qaytadan urinib ko'ring.");
      }
    } catch (error) {
      console.error("AI service error:", error);
      typeMessage("Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-[80%] mx-auto h-[80vh]">
      {/* Chat messages container */}
      <div className="h-[90%] overflow-y-auto pb-4 pr-2 pl-2">
        {fetchingHistory ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-500">
              Xabarlar yuklanmoqda...
            </div>
          </div>
        ) : messages.length === 0 && !typingMessage ? (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={AiChatLogo}
              alt="AI Assistant"
              className="max-w-[200px]"
            />
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {typingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {typingMessage}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="input-box flex shadow-lg w-full rounded-lg overflow-hidden bg-white absolute left-0 bottom-0">
        <input
          className="w-[95%] p-3 px-4 outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Yozing..."
          disabled={loading || fetchingHistory}
        />
        <button
          className={`w-[5%] flex items-center justify-center text-white ${
            loading || !input.trim() || fetchingHistory
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleSendMessage}
          disabled={loading || !input.trim() || fetchingHistory}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default AiChat;
