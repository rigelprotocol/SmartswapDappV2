import { useEffect } from 'react'
import {connectorKey, ConnectorNames} from "../../connectors";
import useAuth from "./useAuth";

const binanceChainListener = async () =>
    new Promise<void>((resolve) =>
        Object.defineProperty(window, 'BinanceChain', {
            get() {
                return this.bsc
            },
            set(bsc) {
                this.bsc = bsc;

                resolve()
            },
        }),
    );

const useConnectWallet = () => {
    const { login } = useAuth();

    useEffect(() => {
        const connectorId = window.localStorage.getItem(connectorKey) as ConnectorNames;

        if (connectorId) {
            const isConnectorBinanceChain = connectorId === ConnectorNames.BSC;
            const isBinanceChainDefined = Reflect.has(window, 'BinanceChain');

            if (isConnectorBinanceChain && !isBinanceChainDefined) {
                binanceChainListener().then(() => login(connectorId));

                return
            }

            login(connectorId)
        }
    }, [login])
};

export default useConnectWallet;
