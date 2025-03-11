import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* Static assets */
import Braavos_Terminal_Icon from "../../static/terminal_icon.png";
import Hugo_Theme_Icon from "../../static/hugo-theme-cactus-logo.png";
import Signature from "../../static/tuna_cici_sign_bw.svg";
import SignatureGIF from "../../static/tuna_cici_sign_bw.gif";
import ItamiSound from "./itami.mp3"
import PainImage from "./pain.png"; // Impor gambar pain.png dari folder yang sama
/* CSS */
import "./Launchpad.css";

/* Shapes */
function importAll(r) {
  let shapes = {};
  r.keys().forEach((item) => { shapes[item.replace("./", "")] = r(item); });
  return shapes;
}

const shapes = importAll(require.context("../../static/background", false, /\.svg$/));

function Launchpad(props) {
  const navigate = useNavigate();

  const launchApp = (e) => {
    const app = e.currentTarget.dataset.app;
  };

  const animateSignature = () => {
    const signature = document.getElementById("launchpadSignature");
    signature.src = SignatureGIF;

    setTimeout(() => {
      signature.classList.add("fade-in");
      signature.src = Signature;
    }, 4500);
  };

  useEffect(() => {
    const canvas = document.getElementById("launchpadCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function changeBackground() {
      const launchpadCanvas = document.getElementById("launchpadCanvas");
      if (!launchpadCanvas) return;

      let maxAmount = 0;
      if (window.innerWidth < 768) maxAmount = 6;
      else if (window.innerWidth < 1024) maxAmount = 10;
      else maxAmount = 12;

      const randomImage = [];
      const randomWidth = [];
      const random2DPos = [];

      for (let i = 0; i < maxAmount; i++) {
        const random = Math.floor(Math.random() * Object.keys(shapes).length);
        randomImage.push(shapes[Object.keys(shapes)[random]]);
        randomWidth.push(Math.floor(Math.random() * 64) + 64);
        random2DPos.push({
          x: Math.floor(Math.random() * (window.innerWidth - 128)),
          y: Math.floor(Math.random() * (window.innerHeight - 128)),
        });
      }

      const urls = randomImage.map((image) => `url(${image})`);
      const widths = randomWidth.map((width) => `${width}px`);
      const positions = random2DPos.map((pos) => `${pos.x}px ${pos.y}px`);

      launchpadCanvas.style.backgroundImage = urls.join(", ");
      launchpadCanvas.style.backgroundSize = widths.join(", ");
      launchpadCanvas.style.backgroundPosition = positions.join(", ");

      launchpadCanvas.style.opacity = 1;
      setTimeout(() => {
        if (launchpadCanvas) launchpadCanvas.style.opacity = 0;
      }, 2000);
    }

    setTimeout(() => {
      const terminalApp = document.getElementById("terminalApp");
      if (terminalApp) terminalApp.classList.add("shake-like-nicki");

      setTimeout(() => {
        const blogApp = document.getElementById("blogApp");
        if (blogApp) blogApp.classList.add("shake-like-nicki");
      }, 1000);
    }, 1000);

    changeBackground();
    const bgLoop = setInterval(changeBackground, 4000);

    // Inisialisasi Audio Backsound
    const audio = new Audio(ItamiSound);
    audio.loop = true; // Agar berulang terus
    audio.volume = 0.5; // Volume default (0.0 - 1.0)
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      // Autoplay mungkin diblokir, tambahkan interaksi pengguna untuk memulai
      document.body.addEventListener("click", () => audio.play(), { once: true });
    });

    // Inisialisasi Chatbot
    const chatbotPanel = document.createElement("div");
    chatbotPanel.className = "chatbot-panel";

    const toggleButton = document.createElement("button");
    toggleButton.className = "chatbot-toggle";

    // Tambahkan gambar Pain sebagai latar awal tombol
    const painImg = document.createElement("img");
    painImg.src = PainImage;
    painImg.alt = "Pain";
    painImg.style.width = "100%"; // Sesuaikan ukuran gambar dengan tombol
    painImg.style.height = "100%";
    painImg.style.objectFit = "cover"; // Agar gambar terpotong rapi
    toggleButton.appendChild(painImg);

    const container = document.createElement("div");
    container.className = "chatbot-container";
    container.style.display = "none";

    const header = document.createElement("div");
    header.className = "chatbot-header";
    header.textContent = "Pain's Chat";

    const body = document.createElement("div");
    body.className = "chatbot-body";

    const footer = document.createElement("div");
    footer.className = "chatbot-footer";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Ask Pain...";

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";

    // State sederhana
    let isOpen = false;
    let messages = [];
    let isLoading = false;
    let isFirstMessage = true;

    // Fungsi untuk menampilkan welcome message
    function showWelcomeMessage() {
      const welcomeMessage = document.createElement("div");
      welcomeMessage.className = "chat-message bot";
      welcomeMessage.textContent = "I am Pain, what can I help you with?";
      body.appendChild(welcomeMessage);
      body.scrollTop = body.scrollHeight;
    }

    // Fungsi toggle
    function togglePanel() {
      isOpen = !isOpen;
      if (isOpen) {
        toggleButton.innerHTML = ""; // Hapus gambar
        toggleButton.textContent = "×"; // Ganti dengan X
      } else {
        toggleButton.innerHTML = ""; // Hapus X
        toggleButton.appendChild(painImg); // Kembali ke gambar Pain
      }
      container.style.display = isOpen ? "flex" : "none";
      chatbotPanel.className = `chatbot-panel ${isOpen ? "open" : ""}`;
      if (isOpen && messages.length === 0) {
        showWelcomeMessage();
      }
    }

    // Fungsi tambah pesan
    function addMessage(text, sender) {
      const message = document.createElement("div");
      message.className = `chat-message ${sender}`;
      message.textContent = text;
      body.appendChild(message);
      body.scrollTop = body.scrollHeight;
    }

    // Fungsi kirim pesan
    async function handleSend(e) {
      if (e.key === "Enter" || e.type === "click") {
        const inputValue = input.value.trim();
        if (!inputValue) return;

        addMessage(inputValue, "user");
        input.value = "";
        isLoading = true;
        addMessage("...", "bot loading-dots");

        try {
          const messagesToSend = isFirstMessage
            ? [
                {
                  role: "system",
                  content: "You are Pain from the Naruto series. Respond as Pain would, with his personality and perspective.",
                },
                { role: "user", content: inputValue },
              ]
            : [{ role: "user", content: inputValue }];

          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: "Bearer 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",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: messagesToSend,
              model: "gemma2-9b-it",
            }),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          const botMessage = data.choices[0].message.content;

          body.lastChild.remove(); // Hapus loading
          addMessage(botMessage, "bot");
          isFirstMessage = false; // Setelah pesan pertama, flag menjadi false
        } catch (error) {
          console.error("Error:", error);
          body.lastChild.remove();
          addMessage("The world shall know pain, but it seems I cannot assist you now.", "bot");
        } finally {
          isLoading = false;
        }
      }
    }

    // Event listener
    toggleButton.addEventListener("click", togglePanel);
    sendButton.addEventListener("click", handleSend);
    input.addEventListener("keypress", handleSend);

    // Susun elemen chatbot
    footer.appendChild(input);
    footer.appendChild(sendButton);
    container.appendChild(header);
    container.appendChild(body);
    container.appendChild(footer);
    chatbotPanel.appendChild(toggleButton);
    chatbotPanel.appendChild(container);
    document.body.appendChild(chatbotPanel);

    // Cleanup saat komponen unmount
    return () => {
      clearInterval(bgLoop);
      chatbotPanel.remove();
    };
  }, []);

  return (
    <div id="launchpad" className="launchpad">
      <div className="background-placeholder" style={{}}></div>
      <div className="terminal-text">
        <p>The World Shall Know Pain!</p>
      </div>
      <canvas id="launchpadCanvas" className="launchpad-canvas"></canvas>
      <div className="launchpad-footer" onClick={animateSignature}>
        <hr className="launchpad-footer-hr" />
        <div className="launchpad-footer-text">Akatsuki Arc</div>
      </div>
    </div>
  );
}

export default Launchpad;