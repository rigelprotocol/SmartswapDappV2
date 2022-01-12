import {
    Modal,
    Box,
    Text,
    Flex,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { BinanceIcon, EthereumIcon } from '../NetworkConnector/Icons';
import { useColorModeValue } from '@chakra-ui/react';
import { CHAIN_INFO } from '../../constants/chains';
import detectEthereumProvider from '@metamask/detect-provider';

interface uProps {
    openModal: boolean
    setDisplayModal: React.Dispatch<React.SetStateAction<boolean>>
}



function UnsupportNetwork({ openModal, setDisplayModal }: uProps) {
    const mode = useColorModeValue('light', 'dark')

    const checkMetamask = () => {
        const provider = detectEthereumProvider();
        return !!provider;
    };


    const switchToSupportedNetwrk = async (chain: string) => {
        if (checkMetamask()) {
            try {
                await window.ethereum?.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chain }],
                });
                // window.location.reload();
            } catch (switchError) {
                console.log(switchError)
                // This error code indicates that the chain has not been added to MetaMask.
                //  if (switchError.code === 4902) {
                // addBSCToMetamask();
                //  }
                // handle other  errors codes
            }
        }
    };

    return (
        <>
            <Modal isOpen={openModal} onClose={() => setDisplayModal(false)} size="sm">
                <ModalOverlay />
                <ModalContent>
                    <Flex flexDirection="column" mx={5}>
                        <Flex my={4}>
                            <ModalCloseButton
                                border={
                                    mode === 'dark' ? '1px solid #FFF' : '1px solid #666666'
                                }
                            />
                        </Flex>
                        <Flex mt={8}>
                            <Text
                                fontSize="20px"
                                lineHeight="28px"
                                color={mode === 'dark' ? '#F1F5F8' : '#333333'}
                            >
                                Wrong Network
                            </Text>
                        </Flex>
                        <Flex>
                            <Text
                                fontSize="16px"
                                lineHeight="28px"
                                color={mode === 'dark' ? '#F1F5F8' : '#333333'}
                                mb={3}
                            >
                                Please switch your wallet
                            </Text>
                        </Flex>
                        <Flex
                            backgroundColor={mode === 'dark' ? '#15202B' : '#FFFFFF'}
                            border={
                                mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'
                            }
                            borderRadius="6px"
                            py={4}
                            px={3}
                            mb={3}
                            cursor="pointer"
                            onClick={() => {
                                setDisplayModal(false)
                                switchToSupportedNetwrk('0x3')
                                // switchNetwork('0x1', account as string, library as Web3Provider);
                            }}
                        >
                            <Box px={2}>
                                <EthereumIcon />
                            </Box>
                            <Box>{CHAIN_INFO[3]?.label}</Box>
                        </Flex>
                        <Flex
                            backgroundColor={mode === 'dark' ? '#15202B' : '#FFFFFF'}
                            border={
                                mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'
                            }
                            borderRadius="6px"
                            py={4}
                            px={3}
                            mb={3}
                            cursor="pointer"
                            onClick={() => {
                                setDisplayModal(false)
                                switchToSupportedNetwrk('0x38')
                                // switchNetwork('0x38', account as string, library as Web3Provider);
                            }}
                        >
                            <Box px={2}>
                                <BinanceIcon />
                            </Box>
                            <Box>{CHAIN_INFO[56]?.label} Smart Chain</Box>
                        </Flex>
                        <Flex
                            backgroundColor={mode === 'dark' ? '#15202B' : '#FFFFFF'}
                            border={
                                mode === 'dark' ? '1px solid #324D68' : '1px solid #DEE6ED'
                            }
                            borderRadius="6px"
                            px={3}
                            py={4}
                            mb={4}
                            cursor="pointer"
                            onClick={() => {
                                setDisplayModal(false)
                                switchToSupportedNetwrk('0x89')
                                // switchNetwork('0x89', account as string, library as Web3Provider);
                            }}
                        >
                            <Box px={2}>
                                <EthereumIcon />
                            </Box>
                            <Box>{CHAIN_INFO[137]?.label}</Box>
                        </Flex>
                    </Flex>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UnsupportNetwork;