import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import Providers from "./Providers";
import ListsUpdater from "./state/lists/updater"
import { TourProvider } from '@reactour/tour'
import { tourSteps } from "./components/Onboarding/Steps";

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
      <TourProvider steps={tourSteps}>
        <App />
      </TourProvider>
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);
