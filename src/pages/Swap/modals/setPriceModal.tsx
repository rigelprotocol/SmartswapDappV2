import React, { useState } from "react";
import {
    ModalOverlay,
    ModalContent,
    Modal,
    ModalCloseButton,
    ModalHeader,
    useDisclosure,
    useColorModeValue,
    Box,
    Flex,
    Text,
    Button,
    Image,
    Checkbox
} from "@chakra-ui/react";
import { InfoOutlineIcon, ArrowDownIcon } from "@chakra-ui/icons";
import RGPImage from "./../../../assets/tokens/RGP.svg";
import USDTImage from "./../../../assets/tokens/USDT.svg";

export type IModal = {
    title: string;
    from?: string | undefined;
    to?: string | undefined;
    fromDeposited?: string;
    toDeposited?: number;
    slippage?: number;
    showModal: boolean;
    setShowModal: Function;
    inputLogo: string;
    outputLogo: string;
    pathSymbol: string;
    signSignature: () => void;
    minimumAmountToRecieve: string;
    buttonText: string,
    setCheckedItem: Function,
    checkedItem: boolean,
    frequency:string
};

const SetPriceModal: React.FC<IModal> = ({
    title,
    from,
    to,
    fromDeposited,
    toDeposited,
    showModal,
    setShowModal,
    inputLogo,
    outputLogo,
    pathSymbol,
    signSignature,
    minimumAmountToRecieve,
    buttonText,
    slippage,
    frequency
}) => {
    const bgColor = useColorModeValue("#FFF", "#15202B");
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const textColor = useColorModeValue("#4CAFFF", "#319EF6");
    const borderColor = useColorModeValue("#DEE6ED", "#324D68");
    const boxColor = useColorModeValue("#F2F5F8", "#213345");
    const { onClose } = useDisclosure();


    const tokenPrice = (Number(toDeposited) / Number(fromDeposited)).toFixed(4);
    const [checkedItem,setCheckedItem] = useState(false);
    return (
        <>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered>
                <ModalOverlay />
                <ModalContent
                    width='95vw'
                    borderRadius='6px'
                    paddingBottom='20px'
                    bgColor={bgColor}
                    minHeight='40vh'
                    marginTop="200px"
                >
                    <ModalHeader fontSize='18px' fontWeight='regular'>
                        {title}
                    </ModalHeader>
                    <ModalCloseButton
                        bg='none'
                        size={"sm"}
                        mt={3}
                        mr={3}
                        cursor='pointer'
                        _focus={{ outline: "none" }}
                        onClick={onClose}
                        p={"7px"}
                        border={"1px solid"}
                    />
                    <Box width='90%' margin='0 auto' fontSize='14px'>
                        <Box
                            bgColor={boxColor}
                            border={`1px solid ${borderColor}`}
                            borderRadius='6px'
                            padding='10px'
                            fontWeight='normal'
                            fontSize='24px'
                        >
                            <Text fontSize='16px' color={lightTextColor}>
                                From
                            </Text>
                            <Flex justifyContent='space-between' mt='2'>
                                <Flex>
                                    <Image src={inputLogo || RGPImage} boxSize={"24px"} mr='2' mt="2" />{" "}
                                    <Text>{from}</Text>
                                </Flex>
                                <Text color={heavyTextColor}>{fromDeposited}</Text>
                            </Flex>
                        </Box>
                        <Box display='flex' justifyContent='center' my='-4'>
                            <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='center'
                                alignItems='center'
                                width='40px'
                                height='40px'
                                bgColor={boxColor}
                                border={`3px solid ${borderColor}`}
                                boxSizing='border-box'
                                borderRadius='12px'
                            >
                                <ArrowDownIcon w={5} h={10} />
                            </Box>
                        </Box>

                        <Box
                            bgColor={boxColor}
                            border={`1px solid ${borderColor}`}
                            borderRadius='6px'
                            padding='10px'
                            fontWeight='normal'
                            fontSize='24px'
                        >
                            <Flex justifyContent='space-between'>
                                <Text fontSize='16px' color={lightTextColor}>
                                    To
                                </Text>
                                {/* <Text fontSize='11px' mt='1'>current to price</Text> */}
                            </Flex>

                            <Flex justifyContent='space-between' mt='2'>
                                <Flex>
                                    <Image
                                        boxSize={"24px"}
                                        src={outputLogo || USDTImage}
                                        mr='2' mt="2"
                                    />{" "}
                                    <Text>{to}</Text>
                                </Flex>
                                <Text color={heavyTextColor}>{toDeposited}</Text>
                            </Flex>
                        </Box>
                        <Box my='5'>
                            <Flex justifyContent='space-between' fontSize='14px'>
                                <Text color={lightTextColor}>Price</Text>
                                <Text color={heavyTextColor} fontWeight='bold'>
                                    1 {from} = {tokenPrice} {to}
                                </Text>
                            </Flex>
                        </Box>
                        <Box
                            border={`1px solid ${borderColor}`}
                            borderRadius='6px'
                            padding='10px'
                            fontWeight='normal'
                            background={boxColor}
                            fontSize='14px'
                            margin='15px 0'
                        >

                            <Flex justifyContent='space-between' my='4'>
                                <Box color={lightTextColor}>
                                    Route <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor} fontWeight='500'>
                                    {pathSymbol}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between' my='4'>
                                <Box color={lightTextColor}>
                                    Number of transaction <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor} fontWeight='500'>
                                    {frequency}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between' my='4'>
                                <Box color={lightTextColor}>
                                    Slippage <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor} fontWeight='500'>
                                    {slippage}%
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between' my='4'>
                                <Box color={lightTextColor}>
                                    Minimum Amount to recieve <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor} fontWeight='500'>
                                    {minimumAmountToRecieve}
                                </Text>
                            </Flex>

                        </Box>
                        <Box
                            border={`1px solid ${borderColor}`}
                            borderRadius='6px'
                            padding='10px'
                            fontWeight='normal'
                            background={boxColor}
                            fontSize='14px'
                            margin='15px 0'
                        >
                            <Text>Signing this transaction means you are giving us access to swap on your behalf. The swapping will be done based on the parameters you inputted. The swap will occur if and only if the price of <Text as='span' color={textColor}>{to}</Text> is greater than or equals to <Text as='span' color={textColor}>{toDeposited}</Text></Text>
                        </Box>
                        <Box mb="1">
                        <Checkbox
          isChecked={checkedItem}
          onChange={(e) => setCheckedItem(e.target.checked)}
        >
             I agree to this changes
        </Checkbox>
                        </Box>
                        <Button
                            bgColor={textColor}
                            _hover={{
                                bgColor: "none",
                            }}
                            disabled={!checkedItem}
                            variant='brand'
                            isFullWidth
                            padding='24px 0'
                            boxShadow='none'
                            onClick={() => {
                                signSignature();
                                setShowModal(!showModal);
                            }}
                        >
                            {buttonText}
                        </Button>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SetPriceModal;
