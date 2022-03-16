import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import './index.css';
import App from "./pages/App";
import Providers from "./Providers";
import ListsUpdater from "./state/lists/updater"
function Updaters() {
  return (
    <>
      <ListsUpdater />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <Updaters />
      <ColorModeScript />
      {/**/}

      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);
