
Import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Adding a relative path check to ensure it hits the root
    const swPath = `${import.meta.env.BASE_URL}sw.js`;
    
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        // This tells the SW to update immediately if a new version exists
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content available; please refresh.');
            }
          };
        };
        console.log("SKIPGYM Offline Ready:", reg.scope);
      })
      .catch((err) => {
        console.log("Offline setup failed:", err);
      });
  });
}
