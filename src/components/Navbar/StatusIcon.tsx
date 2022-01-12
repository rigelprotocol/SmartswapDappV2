import React from "react";
import {Image} from '@chakra-ui/react';
import {AbstractConnector} from "@web3-react/abstract-connector";
import {bscConnector, injected, walletconnect} from "../../connectors";
import MetamaskLogo from "../../assets/metamaskLogo.png";
import WalletConnectLogo from "../../assets/walletconnect-logo.svg";
import BinanceLogo from "../../assets/BNB.svg";



const StatusIcon = ({connector} : {connector?: AbstractConnector}) => {
    if (connector === injected) {
        return <Image boxSize="20px" objectFit="contain" src={MetamaskLogo} />;
    } else if (connector === walletconnect) {
        return <Image boxSize="20px" objectFit="contain" src={WalletConnectLogo} />;
    } else if (connector === bscConnector) {
        return <Image boxSize="20px" objectFit="contain" src={BinanceLogo} />;
    }
    return null;
};

export default StatusIcon;