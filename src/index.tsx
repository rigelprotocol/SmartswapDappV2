import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import Providers from "./Providers";

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <ColorModeScript />
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);
