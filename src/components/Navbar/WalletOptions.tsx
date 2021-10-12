import React from 'react';
import { Flex, Text } from '@chakra-ui/layout';
import {ModalBody, ModalHeader, Image, useColorModeValue} from '@chakra-ui/react';
import MetaMaskImage from '../../assets/metamask.svg';
import TrustWallet from '../../assets/TrustWallet.svg';
import BinanceWallet from "../../assets/BNB.svg";
import WalletConnect from "../../assets/walletconnect-logo.svg";
import SafePal from '../../assets/safepal-sfp.svg';

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
            rounded="2xl"
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
        connect
    }, {
        name: 'Trust Wallet',
        image: TrustWallet,
        connect
    }, {
        name: 'Binance Chain Wallet',
        image: BinanceWallet,
        connect
    }, {
        name: 'Wallet Connect',
        image: WalletConnect,
        connect
    }, {
        name: 'SafePal',
        image: SafePal,
        connect
    }];

    return (
        <>
            <ModalHeader mt={4} fontWeight="regular" fontSize={'20px'}>
                Choose a wallet
            </ModalHeader>
            <ModalBody mt={4}>
                {walletItems.map((item) => (
                    <>
                        <WalletItem name={item.name} image={item.image} connect={item.connect}/>
                    </>
                ))}
            </ModalBody>
        </>
        )
};

export default WalletOptions;
