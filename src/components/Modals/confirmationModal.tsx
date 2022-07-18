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
    Circle, Button, Link,
    Flex
} from "@chakra-ui/react";
import { ArrowUpIcon } from '@chakra-ui/icons'


type IModal = {
    text: String;
    deleteDataFromDatabase: Function;
    showModal: boolean,
    setShowModal: Function
}


const ConfirmationModal: React.FC<IModal> = ({
    text,
    deleteDataFromDatabase,
    showModal,
    setShowModal
}) => {
    const bgColour = useColorModeValue("#FFFFFF", "#15202B");
    const textColour = useColorModeValue("#333333", "#F1F5F8");
    const closeBtnColour = useColorModeValue("#666666", "#DCE5EF");
    const closeButtonBgColour = useColorModeValue("#319EF6", "#008DFF");
    const transBgColour = useColorModeValue("#2F82D0", "#2F82D0");
    const bckColor = useColorModeValue("white", "white");
    const bckHover = useColorModeValue("#319EF6", "#008DFF");
    const { onClose } = useDisclosure();

    function continueTransaction() {
        onClose()
        deleteDataFromDatabase()
    }
    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered>
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
                        <Circle size="90px" background={transBgColour} my={8}>
                            <Circle size="80px" background={bgColour} my={3}>
                                <ArrowUpIcon width="30px" height="30" color={transBgColour} />
                            </Circle>
                        </Circle>
                        <Text fontSize="16px" py={5} fontWeight="bold" color={textColour}>
                            {text}
                        </Text>
                        <Flex justifyContent="space-between">
                            <Button
                                variant="brand"
                                padding="24px 0"
                                width="100%"
                                boxShadow="none"
                                border={`1px solid ${closeButtonBgColour}`}
                                backgroundColor="transparent"
                                mt={3}
                                _hover={{ backgroundColor: bckHover, color: bckColor }}
                                color={textColour}
                                cursor="pointer"
                                onClick={continueTransaction}
                                marginRight="50px"
                            >
                                Continue
                            </Button>
                            <Button
                                variant="brand"
                                padding="24px 0"
                                width="100%"
                                boxShadow="none"
                                border="0"
                                mt={3}
                                background={closeButtonBgColour}
                                color="#FFFFFF"
                                cursor="pointer"
                                onClick={()=>setShowModal(false)}
                            >
                                Close
                            </Button>
                        </Flex>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )

}


export default ConfirmationModal
