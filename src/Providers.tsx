import React from "react";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { NetworkContextName } from "./constants";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import store from "./state";
import getLibrary from "./utils/getLibrary";
import MetamaskProvider from "./connectors/MetamaskProvider";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <MetamaskProvider>
        <Provider store={store}>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </Provider>
        </MetamaskProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

export default Providers;
