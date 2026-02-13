import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { initConfig } from "./config";
import "./utils/systemInterceptor";


initConfig().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
