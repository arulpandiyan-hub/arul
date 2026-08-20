import { useState } from "react";

import {
  Sparkles,
  Send,
  Mic,
  Lightbulb,
  Fan,
  Zap,
  Bot,
  User,
} from "lucide-react";

function AI() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! I'm your SmartHome AI assistant. How can I help you control your home?",
    },
  ]);

  const suggestions = [
    {
      icon: Lightbulb,
      text: "Turn on the light",
    },
    {
      icon: Fan,
      text: "Turn on the fan",
    },
    {
      icon: Zap,
      text: "Turn everything off",
    },
  ];

  const sendMessage = (text = message) => {
    const cleanMessage = text.trim();

    if (!cleanMessage) return;

    setMessages((current) => [
      ...current,
      {
        type: "user",
        text: cleanMessage,
      },
    ]);

    setMessage("");

    // Temporary frontend response.
    // Later this will call FastAPI + Gemini API.
    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          type: "ai",
          text: `I received: "${cleanMessage}". Gemini AI + FastAPI connection will be added next.`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="ai-page">

      {/* HEADER */}

      <div className="ai-header">

        <div className="ai-title-area">

          <div className="ai-logo">
            <Sparkles size={27} />
          </div>

          <div>

            <div className="section-label">
              SMART HOME AI
            </div>

            <h1>AI Assistant</h1>

            <p>
              Your intelligent home companion.
            </p>

          </div>

        </div>


        <div className="ai-online">
          <span></span>
          GEMINI READY
        </div>

      </div>


      {/* AI STATUS */}

      <div className="ai-status-card">

        <div className="ai-status-icon">
          <Bot size={23} />
        </div>

        <div>

          <strong>
            SmartHome AI
          </strong>

          <span>
            Ready to understand your commands
          </span>

        </div>

        <div className="ai-status-dot">
          <span></span>
          ONLINE
        </div>

      </div>


      {/* CHAT */}

      <div className="ai-chat">

        <div className="chat-title">

          <span>
            CONVERSATION
          </span>

          <small>
            {messages.length} messages
          </small>

        </div>


        <div className="messages">

          {messages.map((item, index) => (

            <div
              key={index}
              className={
                item.type === "ai"
                  ? "message-row ai-message-row"
                  : "message-row user-message-row"
              }
            >

              <div
                className={
                  item.type === "ai"
                    ? "message-avatar ai-avatar"
                    : "message-avatar user-avatar"
                }
              >

                {item.type === "ai" ? (
                  <Sparkles size={17} />
                ) : (
                  <User size={17} />
                )}

              </div>


              <div
                className={
                  item.type === "ai"
                    ? "message-bubble ai-bubble"
                    : "message-bubble user-bubble"
                }
              >

                <span className="message-name">

                  {item.type === "ai"
                    ? "SmartHome AI"
                    : "You"}

                </span>

                <p>
                  {item.text}
                </p>

              </div>

            </div>

          ))}

        </div>


        {/* SUGGESTIONS */}

        <div className="ai-suggestions">

          <span>
            QUICK COMMANDS
          </span>

          <div>

            {suggestions.map((item, index) => {

              const Icon = item.icon;

              return (
                <button
                  key={index}
                  onClick={() =>
                    sendMessage(item.text)
                  }
                >

                  <Icon size={15} />

                  {item.text}

                </button>
              );

            })}

          </div>

        </div>


        {/* INPUT */}

        <div className="ai-input-area">

          <button
            className="ai-mic-button"
            title="Voice input"
          >
            <Mic size={19} />
          </button>


          <input
            type="text"
            placeholder="Ask your home..."
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={(event) => {

              if (event.key === "Enter") {
                sendMessage();
              }

            }}
          />


          <button
            className="ai-send-button"
            onClick={() => sendMessage()}
            disabled={!message.trim()}
          >
            <Send size={18} />
          </button>

        </div>

      </div>


      {/* FEATURES */}

      <div className="ai-feature-grid">

        <div className="ai-feature">

          <Sparkles size={19} />

          <div>
            <strong>
              Natural Language
            </strong>

            <span>
              Talk normally to control devices.
            </span>
          </div>

        </div>


        <div className="ai-feature">

          <Zap size={19} />

          <div>
            <strong>
              Smart Actions
            </strong>

            <span>
              AI can understand home commands.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AI;