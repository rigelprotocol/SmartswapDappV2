import React from "react";
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
  toDeposited?: string;
  minRecieved?: string | number;
  fee?: string;
  priceImpact?: number;
  slippage?: number;
  showModal: boolean;
  setShowModal: Function;
  inputLogo: string;
  outputLogo: string;
  handleSwap: () => void;
  pathSymbol: string;
  showNewChangesText:boolean
};

const ConfirmModal: React.FC<IModal> = ({
  title,
  from,
  to,
  fromPrice,
  fromDeposited,
  toDeposited,
  minRecieved,
  slippage,
  priceImpact,
  fee,
  showModal,
  setShowModal,
  inputLogo,
  outputLogo,
  handleSwap,
  pathSymbol,
  showNewChangesText
}) => {
  const bgColor = useColorModeValue("#FFF", "#15202B");
  const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
  const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
  const borderColor = useColorModeValue("#DEE6ED", "#324D68");
  const boxColor = useColorModeValue("#F2F5F8", "#213345");
  const { onClose } = useDisclosure();

  const amountIn = Number(minRecieved).toFixed(4);

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
                  <Image src={inputLogo || RGPImage} boxSize={"24px"} mr='2' />{" "}
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
              <Text fontSize='16px' color={lightTextColor}>
                To
              </Text>
              <Flex justifyContent='space-between' mt='2'>
                <Flex>
                  <Image
                    boxSize={"24px"}
                    src={outputLogo || USDTImage}
                    mr='2'
                  />{" "}
                  <Text>{to}</Text>
                </Flex>
                <Text color={heavyTextColor}>{toDeposited}</Text>
              </Flex>
            </Box>
          {showNewChangesText===true &&   <Box my="2" color="red.200">
            <InfoOutlineIcon /> Price changed 
            </Box>}
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
              <Flex justifyContent='space-between'>
                <Box color={lightTextColor}>
                  Minimum received <InfoOutlineIcon />
                </Box>
                <Text color={heavyTextColor}>{minRecieved}</Text>
              </Flex>
              <Flex justifyContent='space-between' my='4'>
                <Box color={lightTextColor}>
                  Route <InfoOutlineIcon />
                </Box>
                <Text color={heavyTextColor} fontWeight='500'>
                  {pathSymbol}
                </Text>
              </Flex>
              <Flex justifyContent='space-between'>
                <Box color={lightTextColor}>
                  Allowed Slippage <InfoOutlineIcon />
                </Box>
                <Text color={heavyTextColor}>{slippage}%</Text>
              </Flex>
              <Flex justifyContent='space-between' my='4'>
                <Box color={lightTextColor}>
                  Price Impact <InfoOutlineIcon />
                </Box>
                <Text
                  color={(priceImpact as number) < -5 ? "red" : heavyTextColor}
                >
                  {priceImpact}%
                </Text>
              </Flex>
              <Flex justifyContent='space-between'>
                <Box color={lightTextColor}>
                  Liquidity Provider Fee <InfoOutlineIcon />
                </Box>
                <Text color={heavyTextColor}>
                  {fee} {from}
                </Text>
              </Flex>
            </Box>
            <Text mb='2' color={lightTextColor}>
              Output is estimated. You will receive at least{" "}
              <Text as='span' color={heavyTextColor}>
                {amountIn} {to}
              </Text>{" "}
              or the transaction will revert.
            </Text>
            <Button
              bgColor={(priceImpact as number) < -5 ? "#FF4243" : undefined}
              _hover={{
                bgColor: (priceImpact as number) < -5 ? "none" : undefined,
              }}
              variant='brand'
              isFullWidth
              padding='24px 0'
              boxShadow='none'
              onClick={() => {
                handleSwap();
                setShowModal(!showModal);
              }}
            >
              {(priceImpact as number) < -5
                ? "Price Impact too high, Swap Anyway"
                : "Confirm Swap"}
            </Button>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmModal;
