import { useCallback } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  ConnectorNames,
  connectorsByName,
  connectorKey,
} from "../../connectors";
import { Web3Provider } from "@ethersproject/providers";
import { NoBscProviderError } from "@binance-chain/bsc-connector";
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";
import {
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
  NoEthereumProviderError,
} from "@web3-react/injected-connector";
import { useDispatch } from "react-redux";
import { addToast } from "../../components/Toast/toastSlice";

const useAuth = () => {
  const context = useWeb3React<Web3Provider>();
  const { activate, deactivate, setError } = context;
  const dispatch = useDispatch();

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID];
      if (connector) {
        activate(connector, async (error: Error) => {
          if (!error) {
            activate(connector);
          }
          if (error instanceof UnsupportedChainIdError) {
            setError({
              name: "UnsupportedChainIdError",
              message: error.message,
            });
          } else {
            window.localStorage.removeItem(connectorKey);
            if (
              error instanceof NoEthereumProviderError ||
              error instanceof NoBscProviderError
            ) {
              dispatch(
                addToast({
                  message: `No Provider was found.`,
                  error: true,
                })
              );
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector;
                walletConnector.walletConnectProvider = null;
              }
              dispatch(
                addToast({
                  message: `Please authorize your account.`,
                  error: true,
                })
              );
            } else {
              dispatch(
                addToast({
                  message: `Please check if wallet is logged in or has pending transactions.`,
                  error: true,
                })
              );
            }
          }
        });
      } else {
        console.log("Unable to connect wallet");
      }
    },
    [activate, setError]
  );

  const logout = useCallback(() => {
    deactivate();
    if (window.localStorage.getItem("walletconnect")) {
      connectorsByName.walletconnect.close();
      connectorsByName.walletconnect.walletConnectProvider = null;
    }
    window.localStorage.removeItem(connectorKey);
    window.localStorage.removeItem("reload");
  }, [deactivate]);

  return { login, logout };
};

export default useAuth;
