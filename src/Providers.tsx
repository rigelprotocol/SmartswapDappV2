import React from "react";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { NetworkContextName } from "./constants";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import store from "./state";
import getLibrary from "./utils/getLibrary";
import {ApolloProvider, ApolloClient, InMemoryCache} from "@apollo/client";


const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

const Providers: React.FC = ({ children }) => {

    const URL = `https://api.thegraph.com/subgraphs/name/joshuarotimi/smart-bid`;

    const defaultClient = new ApolloClient({
        uri: URL,
        cache: new InMemoryCache()
    });

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
          <ApolloProvider client={defaultClient}>
              <Provider store={store}>
                  <ChakraProvider theme={theme}>{children}</ChakraProvider>
              </Provider>
          </ApolloProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

export default Providers;
