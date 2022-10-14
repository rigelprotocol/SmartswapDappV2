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
    Checkbox,
    Img
} from "@chakra-ui/react";
import { InfoOutlineIcon, ArrowDownIcon } from "@chakra-ui/icons";
import RGPImage from "./../../../assets/tokens/RGP.svg";
import USDTImage from "./../../../assets/tokens/USDT.svg";

export type IModal = {
    title: string;
    from?: string | undefined;
    fromPrice?: string;
    to?: string | undefined;
    fromDeposited?: string;
    toDeposited?: string | number;
    slippage: number;
    minimumAmountToRecieve?: string;
    showModal: boolean;
    setShowModal: Function;
    inputLogo: string;
    outputLogo: string;
    pathSymbol: string;
    signSignature: () => void;
    frequency?: string;
    percentageChange?: string;
    situation?: string;
    buttonText: string;
  showNewChangesText:boolean;
  instant?:boolean;
  numberOfTransaction?:string;
  quantity:string | number | undefined;
  market:string
};

const AutoTimeModal: React.FC<IModal> = ({
    title,
    from,
    to,
    fromPrice,
    fromDeposited,
    toDeposited,
    showModal,
    setShowModal,
    inputLogo,
    outputLogo,
    pathSymbol,
    signSignature,
    frequency,
    percentageChange,
    situation,
    buttonText,
    slippage,
    minimumAmountToRecieve,
    showNewChangesText,
    numberOfTransaction,
    quantity,
    market,
    instant
}) => {
    const bgColor = useColorModeValue("#FFF", "#15202B");
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const textColor = useColorModeValue("#4CAFFF", "#319EF6");
    const borderColor = useColorModeValue("#DEE6ED", "#324D68");
    const boxColor = useColorModeValue("#F2F5F8", "#213345");
    const { onClose } = useDisclosure();

    const [checkedItem,setCheckedItem] = useState(false);
    const tokenPrice = (Number(toDeposited) / Number(fromDeposited)).toFixed(4);

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
                               {situation&& <Text fontSize='11px' mt='1'>{situation}</Text>}
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
                        {showNewChangesText===true &&   <Box my="2" color="red.200">
            <InfoOutlineIcon /> Price changed 
            </Box>}
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
                           {frequency && <Flex justifyContent='space-between'>
                                <Box color={lightTextColor}>
                                    Frequency <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor}>{frequency === "5" || frequency === "30" ? `${frequency} minutes` : `${frequency}`}</Text>
                            </Flex>}
                           
                            <Flex justifyContent='space-between' my='4'>
                                <Box color={lightTextColor}>
                                    Route <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor} fontWeight='500'>
                                    {pathSymbol}
                                </Text>
                            </Flex>
                            {quantity && <Flex justifyContent='space-between'>
                                <Box color={lightTextColor}>
                                    Amount withdrawed to contract <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor}>{quantity}</Text>
                            </Flex>}
                          {numberOfTransaction &&  <Flex justifyContent='space-between' my='4'>
                                <Box color={lightTextColor}>
                                    Number of transaction <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor} fontWeight='500'>
                                    {numberOfTransaction}
                                </Text>
                            </Flex>}
                            <Flex justifyContent='space-between' my='4'>
                                <Box color={lightTextColor}>
                                   Market Router <InfoOutlineIcon />
                                </Box>
                                <Flex>
            <Img src={`./images/${market}.png`} width="25px" height="25px" mr="1" /> <Text mt="1">{market}</Text>
          </Flex>
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
                           {percentageChange && <Flex justifyContent='space-between'>
                                <Box color={lightTextColor}>
                                    Percentage Change <InfoOutlineIcon />
                                </Box>
                                <Text color={heavyTextColor}>{percentageChange}%</Text>
                            </Flex>}

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
                            <Text>Signing this transaction means you are giving us access to swap on your behalf. The swapping will be done based on the parameters you inputted. </Text>
                          {!instant &&  <Text>The swap will occur   <Text as='span' color={textColor}>{frequency === "5" || frequency === "30" ? `${frequency} minutes` : `${frequency}`}</Text> only when the <Text as='span' color={textColor}>{to}</Text> price is greater than or equal to the current <Text as='span' color={textColor}>{to}</Text>  price plus <Text as='span' color={textColor}>{percentageChange}</Text>  % of the <Text as='span' color={textColor}>{to}</Text>  price.</Text>}
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

export default AutoTimeModal;
