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
    message?: string;
    trxState: TrxState;
    URLNetwork?: string;
    typeOfModal?: string //for testing purpose please

}
const TransactionStateModal: React.FC<IProps> = ({ message, URLNetwork, trxState, typeOfModal }) => {


    const bgColour = useColorModeValue("#FFFFFF", "#15202B");
    const textColour = useColorModeValue("#333333", "#F1F5F8");
    const smallTxtColour = useColorModeValue("#999999", "#DCE5EF");
    const closeBtnColour = useColorModeValue("#666666", "#DCE5EF");
    const closeButtonBgColour = useColorModeValue("#319EF6", "#008DFF");
    const successBgColour = useColorModeValue("#22BB33", "#75F083");
    const errorBgColour = useColorModeValue("#CC334F", "#FF3358");
    const { isOpen, onOpen, onClose } = useDisclosure();



    return (

        <>

            <Button variant="brand" onClick={onOpen}>
                {typeOfModal}
            </Button>

            {console.log("transction state is ", trxState)}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={bgColour} color="#fff" borderRadius="6px"
                    paddingBottom="15px" width="95vw">
                    <ModalCloseButton
                        bg="none"
                        color={closeBtnColour}
                        cursor="pointer"
                        _focus={{ outline: 'none' }}
                        onClick={onClose}
                        border={'1px solid'}
                        size={'sm'}
                        mt={3}
                        mr={3}
                        p={'7px'}
                    />
                    <ModalBody align="center" my={2}>

                        {trxState === TrxState.WaitingForConfirmation ?
                            <Spinner
                                thickness="4px"
                                speed="0.53s"
                                emptyColor="transparent"
                                color="#319EF6"
                                size="xl"
                                width="100px"
                                height="100px"
                                my={10}
                            /> : trxState === TrxState.TransactionSuccessful ?
                                <Circle size="90px" background={successBgColour} my={8}>
                                    <Circle size="80px" background={bgColour} my={3}>
                                        <CheckIcon fontSize="40px" color={successBgColour} />
                                    </Circle>
                                </Circle> :
                                trxState === TrxState.TransactionFailed ?
                                    <Circle size="90px" background={errorBgColour} my={8}>
                                        <Circle size="80px" background={bgColour} my={3}>
                                            <CloseIcon width="30px" height="30" color={errorBgColour} />
                                        </Circle>
                                    </Circle> : null}


                        <Text fontSize="20px" fontWeight="normal" color={textColour}>
                            {trxState === TrxState.TransactionSuccessful ?
                                "Transaction Succesful" :
                                trxState === TrxState.WaitingForConfirmation ?
                                    " Waiting for Confirmation" :
                                    trxState === TrxState.TransactionFailed ?
                                        " Transaction Not Successful" : null}
                        </Text>

                        {trxState === TrxState.WaitingForConfirmation ?
                            <Text fontSize="16px" py={5} fontWeight="bold" color={textColour}>
                                {message}
                            </Text> :
                            trxState === TrxState.TransactionFailed ?
                                <Text
                                    py={3}
                                    fontSize="14px"
                                    fontWeight="normal"
                                    color="#008DFF">
                                    <a href="#" target="_blank">
                                        Retry
                                    </a>

                                </Text> : trxState === TrxState.TransactionSuccessful ? <Text
                                    py={3}
                                    fontSize="14px"
                                    fontWeight="normal"
                                    color="#008DFF">

                                    {URLNetwork && (<Link href={`https://${URLNetwork}`} isExternal> View on Etherscan </Link>)}
                                </Text> : null}

                        {trxState === TrxState.WaitingForConfirmation ?
                            <Text size="12px" color={smallTxtColour}  >
                                Go to your wallet to confirm this
                            </Text> :
                            <Button
                                variant="brand"
                                padding="24px 0"
                                width="100%"
                                isFullWidth
                                boxShadow="none"
                                border="0"
                                mt={3}
                                background={closeButtonBgColour}
                                color="#FFFFFF"
                                cursor="pointer"
                                onClick={onClose}
                            >
                                Close
                            </Button>}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )

}


export default TransactionStateModal
