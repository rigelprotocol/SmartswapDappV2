import React, { useState, useEffect } from 'react';
import {
    Text,
    Spinner,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Modal,
    ModalBody,
    useColorModeValue,
    useDisclosure,
    Circle, Button, Link
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'


export enum TrxState {
    WaitingForConfirmation,
    TransactionSubmitted,
    TransactionSuccessful,
    TransactionFailed
}

export interface IProps {
    message: string;
    trxState: TrxState;
    URLNetwork?: string;
    isOpen: boolean;
    onClose: () => void;
}
const TransactionStateModal: React.FC<IProps> = ({ message, trxState, URLNetwork, onClose, isOpen }) => {


    const bgColour = useColorModeValue("#FFFFFF", "#15202B");
    const textColour = useColorModeValue("#333333", "#F1F5F8");
    const smallTxtColour = useColorModeValue("#999999", "#DCE5EF");
    const closeBtnColour = useColorModeValue("#666666", "#DCE5EF");
    const closeButtonBgColour = useColorModeValue("#319EF6", "#008DFF");



    const WaitingForConfirmationRender = (): JSX.Element => {

        return (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={bgColour} color="#fff" borderRadius="20px" width="70%">
                    <ModalCloseButton
                        bg="none"
                        border="0px"
                        color={closeBtnColour}
                        cursor="pointer"
                        _focus={{ outline: 'none' }}
                        onClick={onClose}

                    />
                    <ModalBody align="center">
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="transparent"
                            color="#319EF6"
                            size="xl"
                            width="100px"
                            height="100px"
                        />
                        <Text fontSize="18px" fontWeight="normal" py={4} color={textColour}>
                            Waiting for Confirmation
                        </Text>
                        <Text fontSize="16px" fontWeight="bold" color={textColour}>
                            {message}
                        </Text>
                        <Text size="xs" color={smallTxtColour} mt={'20px'} >
                            Go to your wallet to confirm this
                        </Text>

                    </ModalBody>
                </ModalContent>
            </Modal>
        )

    }


    const TransactionSuccessfulRender = (): JSX.Element => {
        return (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={bgColour} color="#fff" borderRadius="20px" width="70%">
                    <ModalCloseButton
                        bg="none"
                        border="0px"
                        color={closeBtnColour}
                        cursor="pointer"
                        _focus={{ outline: 'none' }}
                        onClick={onClose}

                    />
                    <ModalBody align="center" my={2}>
                        <Circle size="80px" background="#68C18A" my={3}>
                            <Circle size="70px" background={bgColour} my={3}>

                                <CheckIcon fontSize="40px" color="#68C18A" />
                            </Circle>
                        </Circle>
                        <Text fontSize="18px" fontWeight="normal" color={textColour}>
                            Transaction Succesful
                        </Text>
                        <Text
                            py={3}
                            fontSize="14px"
                            fontWeight="normal"
                            color="#008DFF"
                        >

                            {URLNetwork && (
                                <Link href="https://etherscan.io" isExternal>
                                    View on Etherscan
                                </Link>
                            )}
                        </Text>
                        <Button
                            width="100%"

                            border="0"
                            py={6}
                            mt={3}
                            background={closeButtonBgColour}
                            color="#FFFFFF"
                            cursor="pointer"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        )

    }

    const TransactionFailedRender = (): JSX.Element => {
        return (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={bgColour} color="#fff" borderRadius="20px" width="70%">
                    <ModalCloseButton
                        bg="none"
                        border="0px"
                        color={closeBtnColour}
                        cursor="pointer"
                        _focus={{ outline: 'none' }}
                        onClick={onClose}

                    />
                    <ModalBody align="center" my={2}>


                        <Circle size="80px" background="#FF3358" my={3}>

                            <Circle size="70px" background={bgColour} my={3}>
                                <CloseIcon width="30px" height="30" color="#FF3358" />
                            </Circle>
                        </Circle>
                        <Text fontSize="18px" fontWeight="normal" color={textColour}>
                            Transaction Not Successful
                        </Text>
                        <Text
                            py={3}
                            fontSize="14px"
                            fontWeight="normal"
                            color="#008DFF"
                        >

                            <a href="#" target="_blank">
                                Retry
                            </a>

                        </Text>
                        <Button
                            width="100%"

                            border="0"
                            py={6}
                            mt={3}
                            background={closeButtonBgColour}
                            color="#FFFFFF"
                            cursor="pointer"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        )

    }


    switch (trxState) {
        case TrxState.WaitingForConfirmation:
            return WaitingForConfirmationRender()
            break;
        case TrxState.TransactionSuccessful:
            return TransactionSuccessfulRender();
            break;
        case TrxState.TransactionFailed:
            return TransactionFailedRender();
            break;
        default:
            return null;
    }
}

export default TransactionStateModal
