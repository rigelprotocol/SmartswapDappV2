import {
    ModalOverlay,
    ModalContent,
    Modal, 
    ModalCloseButton, 
    useDisclosure,
} from "@chakra-ui/react"

export type IModal= {

}
type Props = {
    question: string;
    answers: string[];
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    questionNr: number;
    totalQuestion: number;
}

const ConfirmModal:React.FC<IModal> = ({}) => {
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
      } = useDisclosure();
    return (
        <Modal onClose={onCloseModal} isOpen={isOpenModal} isCentered>
        <ModalOverlay />
        <ModalContent bg="#120136" color="#fff" borderRadius="20px">
            <ModalHeader
             fontSize="18px"
             fontWeight="regular"
             align="center"
            >{title}</ModalHeader>
            <ModalBody>
            <Spinner />
            
                {children}
            </ModalBody>
        </ModalContent>
    </Modal>
    )
}

export default ConfirmModal
