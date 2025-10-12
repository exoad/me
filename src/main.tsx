import { createRoot } from "react-dom/client";
import App from "./App";
const rootDiv = document.getElementById("root");
import "./index.css";
if (rootDiv) {
  const root = createRoot(rootDiv);
  root.render(<App />);
  console.log(
    "%cHello there\n If you're interested in checking out the code, visit my GitHub repo at %chttps://github.com/exoad/me%c.\nHave a great day! :)",
    'color: #61dafb; font-size: 16px;',
    'color: white; font-size: 12px;'
  );
}