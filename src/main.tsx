import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

const rootDiv = document.getElementById("root");

if (rootDiv) {
  const root = createRoot(rootDiv);
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}