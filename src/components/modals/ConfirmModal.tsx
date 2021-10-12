import React from "react"
import {
    ModalOverlay,
    ModalContent,
    Modal, 
    ModalCloseButton,
    ModalHeader,
    useDisclosure,
} from "@chakra-ui/react"

export type IModal= {
title:string;
}
type Props = {
    question: string;
    answers: string[];
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    questionNr: number;
    totalQuestion: number;
}

const ConfirmModal:React.FC<IModal> = ({title}) => {
    const {
        isOpen,
        onOpen,
        onClose,
      } = useDisclosure();
    return (
        <>
        <h3>lojeie iejie</h3>
        <Modal isOpen={true} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                width="95vw"
                borderRadius="6px"
                border={'1px solid'}
                // borderColor={bgColor3}
                minHeight="40vh"
                // boxShadow={shadow}
                // bg={bg}
            >
                <ModalHeader
                     fontSize="18px"
                     fontWeight="regular"
                    >{title}</ModalHeader>
              <ModalCloseButton
                  bg="none"
                  size={'sm'}
                  mt={3}
                  mr={3}
                  cursor="pointer"
                  _focus={{ outline: 'none' }}
                  onClick={onClose}
                  p={'7px'}
                  border={'1px solid'}

              />

            </ModalContent>
          </Modal>
          </>
    )
}

export default ConfirmModal
