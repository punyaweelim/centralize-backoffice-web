import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { initConfig } from "./config.ts";

initConfig().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
