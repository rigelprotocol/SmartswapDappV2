import { useCallback } from 'react'
import {  useWeb3React } from '@web3-react/core'
import {ConnectorNames, connectorsByName, connectorKey} from "../../connectors";


const useAuth = () => {
    const { activate, deactivate } = useWeb3React();

    const login = useCallback((connectorID: ConnectorNames) => {
        const connector = connectorsByName[connectorID];
        if(connector){
            activate(connector, async(error : Error) => {
                if(!error){
                    activate(connector)
                }
            })

        } else {
            console.log('Unable to connect wallet')
        }
    }, [activate]);

    const logout = useCallback(() => {
        deactivate();
        if (window.localStorage.getItem('walletconnect')) {
            connectorsByName.walletconnect.close();
            connectorsByName.walletconnect.walletConnectProvider = null
        }
        window.localStorage.removeItem(connectorKey)
    }, [deactivate]);

    return {login, logout}

};

export default useAuth;