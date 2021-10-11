import React from 'react';
import { Flex, Text } from '@chakra-ui/layout';
import { ModalBody, ModalHeader, Image} from '@chakra-ui/react';
import MetaMaskImage from '../../assets/metamask.svg';
import TrustWallet from '../../assets/TrustWallet.svg';
import BinanceWallet from "../../assets/BNB.svg";

const WalletItem = ({name, image, connect}: {name: string, image: string, connect: Function}) => {
    return (
        <Flex
            h="50px"
            cursor="pointer"
            _hover={{ border: '1px solid #319EF6' }}
            alignItems="center"
            p={9}
            my={4}
            border={'1px solid'}
            borderColor={'darkBg.100'}
            rounded="2xl"
            onClick={() => connect()}
        >
            <Image src={image} alt="wallet image"  mr={4}/>
            <Text _hover={{ color: 'brand.100' }}>
                {name}
            </Text>
        </Flex>
    )
};

const WalletOptions = ({connect}: {connect: Function}) => (
    <>
        <ModalHeader mt={4} fontWeight="regular" fontSize={'20px'}>
            Choose a wallet
        </ModalHeader>
        <ModalBody mt={4}>
            <WalletItem name={'Meta mask'} image={MetaMaskImage} connect={connect}/>
            <WalletItem name={'Trust Wallet'} image={TrustWallet} connect={connect}/>
            <WalletItem name={'Binance Chain Wallet'} image={BinanceWallet} connect={connect}/>
            <WalletItem name={'Wallet Connect'} image={BinanceWallet} connect={connect}/>
            <WalletItem name={'SafePal'} image={BinanceWallet} connect={connect}/>
        </ModalBody>
    </>
);
export default WalletOptions;
