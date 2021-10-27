import React, { useEffect, useState } from 'react'
import { injected , bscConnector,connectorsByName, walletconnect} from '.'
import { useWeb3React } from '@web3-react/core'

function WalletProvider({ children }: { children: JSX.Element }): JSX.Element  {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()
  const [loaded, setLoaded] = useState(false)
 
  useEffect(() => {

    if( injected){
      injected
       .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injected)
        }
      }) .catch(() => {
        setLoaded(true)
      })
    } if(bscConnector){
      bscConnector
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(bscConnector)
        }
      }) .catch(() => {
        setLoaded(true)
      })
    }
    if (!injected || !bscConnector){
        setLoaded(true)
        if ( !networkActive && !networkError) {
          activateNetwork(walletconnect)
        }
      
    }
  }, [activateNetwork, networkActive, networkError])
  if (loaded) {
    return children
  }
  return <>Loading</>
}

export default WalletProvider