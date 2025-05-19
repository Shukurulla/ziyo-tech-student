import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { AiChatLogo } from "../assets";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // GFM markdown qo'llab-quvvatlash uchun

const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  const typeMessage = (fullText) => {
    let index = 0;
    setTypingMessage("");
    const interval = setInterval(() => {
      setTypingMessage((prev) => prev + fullText[index - 1]);
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { text: fullText, isUser: false }]);
        setTypingMessage("");
      }
    }, 1); // yozilish tezligi
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "gpt-4.1-nano",
            messages: [
              {
                role: "system",
                content:
                  "Iltimos, faqat o‘zbek tilida javob ber. Hech qachon boshqa tillardan foydalanma.",
              },
              {
                role: "user",
                content: input,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiText =
        data.choices?.[0]?.message?.content || "Uzr, javob topilmadi.";

      typeMessage(aiText);
    } catch (error) {
      console.error("API xatosi:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Xatolik yuz berdi. Iltimos, API kalitingizni tekshiring yoki keyinroq urinib ko'ring.",
          isUser: false,
        },
      ]);
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
      <div className="h-[90%] overflow-y-auto pb-4">
        {messages.length === 0 && !typingMessage ? (
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
                  <ReactMarkdown // GFM qo'llanadi
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {typingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                  <ReactMarkdown>{typingMessage}</ReactMarkdown>
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
          disabled={loading}
        />
        <button
          className="w-[5%] flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default AiChat;
