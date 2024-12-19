import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* Static assets */
import Braavos_Terminal_Icon from "../../static/terminal_icon.png";
import Hugo_Theme_Icon from "../../static/hugo-theme-cactus-logo.png";

import Signature from "../../static/tuna_cici_sign_bw.svg";
import SignatureGIF from "../../static/tuna_cici_sign_bw.gif";

/* CSS */
import "./Launchpad.css";

/* Shapes */
function importAll(r) {
  let shapes = {};
  r.keys().forEach((item) => { shapes[item.replace('./', '')] = r(item); });
  return shapes;
}

const shapes = importAll(require.context('../../static/background', false, /\.svg$/));

function Launchpad(props) {
  const navigate = useNavigate();

  const launchApp = (e) => {
    const app = e.currentTarget.dataset.app;
    
    switch (app) {
      case "terminal":
        navigate("/terminal", { replace: true });
        break;
      case "blog":
        // Redirect to the Telegram link
        window.location.href = "https://t.me/pegatruth";
        break;
      default:
        break;
    }
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
      if (!launchpadCanvas) {
        return;
      }

      let maxAmount = 0;
      if (window.innerWidth < 768) {
        maxAmount = 6;
      } else if (window.innerWidth < 1024) {
        maxAmount = 10;
      } else {
        maxAmount = 12;
      }

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
        if (launchpadCanvas) { launchpadCanvas.style.opacity = 0; }
      }, 2000);
    }

    setTimeout(() => {
      const terminalApp = document.getElementById("terminalApp");
      if (terminalApp) {
        terminalApp.classList.add("shake-like-nicki");
      }

      setTimeout(() => {
        const blogApp = document.getElementById("blogApp");
        if (blogApp) {
          blogApp.classList.add("shake-like-nicki");
        }
      }, 1000);
    }, 1000);

    changeBackground();
    const bgLoop = setInterval(changeBackground, 4000);

    return () => {
      clearInterval(bgLoop);
    };
  }, []);

  return (
    <div id="launchpad" className="launchpad">
      <canvas id="launchpadCanvas" className="launchpad-canvas"></canvas>

      <div className="launchpad-grid">
        <li id="terminalApp" className="launchpad-li" onClick={launchApp} data-app="terminal">
          <div className="launchpad-app">
            <img className="launchpad-icon" src={Braavos_Terminal_Icon} alt="Braavos Terminal Icon" />
            <h3 className="launchpad-h3"> Terminal </h3>
          </div>
        </li>

        <li id="blogApp" className="launchpad-li" onClick={launchApp} data-app="blog">
          <div className="launchpad-app">
            <img className="launchpad-icon" src={Hugo_Theme_Icon} alt="Braavos Blog Icon" />
            <h3 className="launchpad-h3"> Telegram </h3> 
          </div>
        </li>
      </div>

      <div className="launchpad-footer" onClick={animateSignature}>
        <hr className="launchpad-footer-hr" />
        <div className="launchpad-footer-text">
          Pegassus Truth Terminal
        </div>
      </div>
    </div>
  );
}

export default Launchpad;