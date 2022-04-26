import React from 'react';
import {
    ModalOverlay,
    ModalContent,
    Modal,
    ModalCloseButton,
    useColorModeValue, ModalHeader, ModalBody, Flex, Text, Image
} from '@chakra-ui/react';
import RGPImage from '../../../assets/rgp.svg';



const RGPModal = ({showRGP, setShowRGP, RGPBalance, RGPPrice}: {
    showRGP: boolean;
    setShowRGP: Function;
    RGPBalance: string;
    RGPPrice: string | number;
}) => {
    const bgColor3 = useColorModeValue('#DEE6ED', '#4A739B');
    const shadow = useColorModeValue(
        '0px 1px 7px -2px rgba(24, 39, 75, 0.06), 0px 2px 2px rgba(24, 39, 75, 0.06)',
        '0px 2px 4px -2px rgba(178, 193, 230, 0.12), 0px 4px 4px -2px rgba(178, 193, 230, 0.08)'
    );
    const bg = useColorModeValue('#FFFFFF', '#15202B');
    const buttonBorder = useColorModeValue('gray.200', 'gray.100');

    return (
        <>
            <Modal
                isOpen={showRGP}
                onClose={() => setShowRGP(false)}
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    width="90vw"
                    borderRadius="6px"
                    borderColor={bgColor3}
                    minHeight="40vh"
                    boxShadow={shadow}
                    bg={bg}
                >
                <ModalCloseButton
                    bg="none"
                size={'sm'}
                mt={6}
                mr={3}
                cursor="pointer"
                _focus={{ outline: 'none' }}
                onClick={() => setShowRGP(false)}
                p={'7px'}
                border={'1px solid'}
                borderColor={buttonBorder}
                />
                    <ModalHeader mt={4} fontWeight="regular" fontSize={'lg'}>
                        Your RGP Breakdown
                    </ModalHeader>
                    <ModalBody mt={4}>
                        <Flex
                            mt="25px"
                            flexDirection="column"
                            h="170px"
                            alignItems="center"
                            justifyContent="center"
                            px={4}
                            rounded="md"
                        >
                            <Image src={RGPImage} boxSize={'50px'}/>
                            <Text zIndex="10" fontSize="4xl" fontWeight="bold" mt={2}>
                                {RGPBalance} RGP
                            </Text>
                        </Flex>
                        <Flex justifyContent="space-between" mb={2}>
                            <Text zIndex="10" fontSize="16px">
                                RGP price:
                            </Text>
                            <Text zIndex="10" fontSize="16px" >
                                ${RGPPrice}
                            </Text>
                        </Flex>
                        <Flex justifyContent="space-between" mb={2}>
                            <Text fontSize="16px">
                                RGP in circulation:
                            </Text>
                            <Text fontSize="16px">
                                805,000 RGP
                            </Text>
                        </Flex>
                        <Flex justifyContent="space-between" mb={2}>
                            <Text fontSize="16px">
                                Total RGP chain maximum supply:
                            </Text>
                            <Text fontSize="16px">
                                20,000,000
                            </Text>
                        </Flex>
                    </ModalBody>
                </ModalContent>
                </Modal>
                </>
    );
};

export default RGPModal;
