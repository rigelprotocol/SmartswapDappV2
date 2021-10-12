import React, { useState } from 'react';
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
    Circle, Button
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
    URLNetwork?: string
    OpenModal: boolean
}
const TransactionStateModal: React.FC<IProps> = ({ message, trxState, URLNetwork, OpenModal }) => {

    TransactionStateModal.defaultProps = {

        OpenModal: true
    }
    const { isOpen, onOpen, onClose } = useDisclosure()

    const bgColour = useColorModeValue("#FFFFFF", "#15202B");
    const textColour = useColorModeValue("#333333", "#F1F5F8");
    const smallTxtColour = useColorModeValue("#999999", "#DCE5EF");
    const closeBtnColour = useColorModeValue("#666666", "#DCE5EF");
    const closeButtonBgColour = useColorModeValue("#319EF6", "#008DFF");


    const WaitingForConfirmationRender = (): JSX.Element => {
        return (
            <Modal isOpen={OpenModal} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={bgColour} color="#fff" borderRadius="20px" width="90%">
                    <ModalCloseButton
                        bg="none"
                        border="0px"
                        color={closeBtnColour}
                        cursor="pointer"
                        _focus={{ outline: 'none' }}
                        onClick={() => { alert("Closes") }}

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
                        <Text fontSize="18px" fontWeight="normal" color={textColour}>
                            Waiting for Confirmation
                        </Text>
                        <Text fontSize="16px" fontWeight="bold" color={textColour}>
                            {message}
                        </Text>
                        <Text fontSize="9px" font='Cera Pro' color={smallTxtColour} mt={'20px'} >
                            Go to your wallet to confirm this
                        </Text>

                    </ModalBody>
                </ModalContent>
            </Modal>
        )

    }

    const TransactionSuccessfulRender = (): JSX.Element => {
        return (
            <Modal isOpen={OpenModal} onClose={onClose} isCentered>
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
                            fontSize="14px"
                            fontWeight="normal"
                            color="#008DFF"
                        >
                            {URLNetwork && (
                                <a href={`${"URLNetwork"}`} target="_blank">
                                    View on BSCSCAN
                                </a>
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
            <Modal isOpen={OpenModal} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={bgColour} color="#fff" borderRadius="20px" width="90%">
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
                            fontSize="14px"
                            fontWeight="normal"
                            color="#008DFF"
                        >
                            {URLNetwork && (
                                <a href={`${"URLNetwork"}`} target="_blank">
                                    Retry
                                </a>
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
