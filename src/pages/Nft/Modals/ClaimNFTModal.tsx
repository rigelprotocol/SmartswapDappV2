import { Box, Button, Divider, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React from 'react'


type comfirmPurchaseModalProps = {
    isOpen: boolean,
    close: () => void
}

const ClaimNFTModal = ({ isOpen, close }: comfirmPurchaseModalProps) => {

  
  const textColor = useColorModeValue("#333333", "#F1F5F8");
  const lightTextColor = useColorModeValue("#666666", "grey");

  return (
        <Modal isOpen={isOpen} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color={textColor} >Claim NFT</ModalHeader>
                <ModalCloseButton />
                <Divider marginTop={'-1.5'}  borderColor={'#DEE5ED'} />
                <ModalBody>
                    <Box
                        marginTop={4}
                        textAlign="center"
                        borderWidth="1px"
                        borderColor={'#DEE5ED'}
                        padding="25px 0"
                        fontWeight="normal"
                        borderRadius={8}
                    >
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >

                            <Image width={54} height={54} src='https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png' alt="logo" />
                            <Text paddingTop={3} fontSize={20} color={textColor} >NFT Name</Text>

                            <Text color={textColor} paddingTop={2} > <span style={{color: lightTextColor}}>Created by:</span>  RigelProtocol</Text>
                        </Flex>
                    </Box>
                    <Box
                        padding={3}
                        borderWidth="1px"
                        borderColor={'#DEE5ED'}
                        fontWeight="normal"
                        marginTop={4}
                        borderRadius={8}
                    >
                        <Flex mt="1" justifyContent="space-between" alignContent="center">
                            <Text color={lightTextColor} >Investment required to claim:</Text>
                            <Text color={textColor}>3000 USD</Text>
                        </Flex>
                        <Flex mt="1" justifyContent="space-between" alignContent="center">
                            <Text color={lightTextColor} >Current investement level:</Text>
                            <Text color={textColor}> 3000 USD </Text>
                        </Flex>
                    </Box>

                  
                    <Button
            mt={5}
            mb={2}
            w={'full'}
            variant='brand'
            color={'white'}
            boxShadow={'0 5px 20px 0px rgba(24, 39, 75, 0.06),'}
            _hover={{
              bg: 'blue.500',
            }}
            _focus={{
              bg: 'blue.500',
            }}>
            Claim NFT
          </Button>

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ClaimNFTModal