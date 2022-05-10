import React from 'react';
import {Flex, Text} from '@chakra-ui/layout';
import {Image, ModalBody, ModalHeader, useColorModeValue} from '@chakra-ui/react';
import MetaMaskImage from '../../assets/metamask.svg';
import TrustWallet from '../../assets/TrustWallet.svg';
import BinanceWallet from "../../assets/BNB.svg";
import WalletConnect from "../../assets/walletconnect-logo.svg";
import SafePal from '../../assets/safepal-sfp.svg';
import {ConnectorNames} from "../../connectors";

const WalletItem = ({name, image, connect}: {name: string, image: string, connect: Function}) => {
    const borderColor = useColorModeValue("lightBg.200", "darkBg.100");

    return (
        <Flex
            h="50px"
            cursor="pointer"
            _hover={{ border: '1px solid #4CAFFF' }}
            alignItems="center"
            p={9}
            my={4}
            border={'1px solid'}
            borderColor={borderColor}
            borderRadius={'6px'}
            onClick={() => connect()}
        >
            <Image src={image} alt="wallet image"  mr={4} boxSize={'30px'} />
            <Text _hover={{ color: '#4CAFFF' }}>
                {name}
            </Text>
        </Flex>
    )
};


const WalletOptions = ({connect}: {connect: Function}) => {
    const walletItems = [{
        name: 'Meta mask',
        image: MetaMaskImage,
        id: ConnectorNames.Injected,
        connect
    }, {
        name: 'Trust Wallet',
        image: TrustWallet,
        id: ConnectorNames.Injected,
        connect
    }, {
        name: 'Binance Chain Wallet',
        image: BinanceWallet,
        id: ConnectorNames.BSC,
        connect
    }, {
        name: 'Wallet Connect',
        image: WalletConnect,
        id: ConnectorNames.WalletConnect,
        connect
    }, {
        name: 'SafePal',
        image: SafePal,
        id: ConnectorNames.Injected,
        connect
    }];

    return (
        <>
            <ModalHeader mt={4} fontWeight="regular" fontSize={'20px'}>
                Choose a wallet
            </ModalHeader>
            <ModalBody mt={4}>
                {walletItems.map((item, i) => (
                    <WalletItem key={i} name={item.name} image={item.image} connect={() => item.connect(item.id,item.name)}/>
                ))}
            </ModalBody>
        </>
        )
};

export default WalletOptions;
