import React from "react"
import { Box, Button, Checkbox, Flex, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useColorModeValue } from "@chakra-ui/react"


type IProductModal= {
    modal1Disclosure:any;
    closeDepositeModal:() => void;
    enoughApproval:(allowance:string,balance:string |undefined) => boolean;
    confirmDeposit:(val:any) => void;
    showMaxValue:(deposit:string,input:string) => void;
    approvalButton:(LPToken:string) => void;
    setDepositTokenValue: React.Dispatch<React.SetStateAction<string>>;
    setReferrerAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
    depositTokenValue:string;
    referrerAddress:string | undefined;
    deposit:string;
    minimumStakeAmount?:number | undefined
    RGPBalance?:string;
    showReferrerField?:boolean;
    isReferrerCheck?:boolean;
    URLReferrerAddress?:string;
    handleSetReferralField?:() =>void;
    depositInputHasError?:boolean;
    refAddressHasError?:boolean;
    depositValue:string;
    allowance:string;
    depositErrorButtonText:string,
    account:any,
    feeAmount?:string,
    approveValueForRGP?:boolean,
    RGPStaked?:string
    
}
export default function ProductModal({
    modal1Disclosure,
    closeDepositeModal,
    setDepositTokenValue,
    depositTokenValue,
    showMaxValue,
    deposit,
    minimumStakeAmount,
    RGPBalance,
    showReferrerField,
    URLReferrerAddress,
    setReferrerAddress,
    referrerAddress,
    handleSetReferralField,
    isReferrerCheck,
    depositInputHasError,
    refAddressHasError,
    depositValue,
    depositErrorButtonText,
    confirmDeposit,
    allowance,
    enoughApproval,
    approvalButton,
    account,
    approveValueForRGP,
    feeAmount,
    RGPStaked
}:IProductModal){

    
  const bgColor = useColorModeValue("#FFF", "#15202B");
  const modalTextColor = useColorModeValue("#333333", "#F1F5F8");
  const modalTextColor2 = useColorModeValue("#666666", "#DCE6EF");
    return (
        <Modal
        isOpen={modal1Disclosure.isOpen}
        onClose={closeDepositeModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          width='95vw'
          borderRadius='6px'
          paddingBottom='20px'
          bgColor={bgColor}
          minHeight='40vh'
        >
          <ModalHeader
            fontSize='20px'
            fontWeight='regular'
            color={modalTextColor}
          >
         {RGPBalance ?  "Stake":`Unstake ${RGPStaked} RGP`}
          </ModalHeader>

          <ModalCloseButton
            bg='none'
            size={"sm"}
            mt={3}
            mr={3}
            cursor='pointer'
            _focus={{ outline: "none" }}
            p={"7px"}
            border={"1px solid"}
          />
          <ModalBody py={2}>
            <Text
              color={modalTextColor}
              mb={3}
              fontSize='14px'
              fontWeight='regular'
            >
              Enter Amount
            </Text>
            <InputGroup size='md'>
              <Input
                placeholder='Enter RGP amount to stake'
                opacity='0.5'
                h='50px'
                borderRadius='6px'
                type="number"
                name='availableToken'
                value={depositTokenValue}
                onChange={(e) =>setDepositTokenValue(e.target.value)}
                border='2px'
              />
              <InputRightElement marginRight='15px'>
                <Button
                  color='rgba(64, 186, 213, 1)'
                  border='none'
                  borderRadius='0px'
                  fontSize='13px'
                  p='1'
                  mt='10px'
                  height='20px'
                  cursor='pointer'
                  background='none'
                  _hover={{ background: "rgba(64, 186, 213, 0.15)" }}
                  onClick={() => showMaxValue(deposit, RGPBalance ?"deposit": "unstake")}
                >
                  MAX
                </Button>
              </InputRightElement>
            </InputGroup>
           {RGPBalance && <>
            <Text color={modalTextColor2} fontSize='14px' mb={5} mt={3}>
              Minimum Stake: {minimumStakeAmount} RGP
            </Text>
            <Flex>
              <Box minWidth="50px" height="2px" backgroundColor="#DEE6ED" mt={6}></Box>
              <Flex fontSize='14px' mb={5} mt={3} mx={2}>
                 <Text color={modalTextColor2}>
              Your Available RGP Balance:</Text> <Text color={modalTextColor}>{RGPBalance} RGP</Text> 
            
              </Flex>
             
            <Box minWidth="50px" height="2px" backgroundColor="#DEE6ED" mt={6}></Box>
            </Flex>
            </>}
            
            
          {showReferrerField &&  <Box display={showReferrerField ? "block" : "none"}>
              <Text color={modalTextColor} fontSize='14px' mb={3}>
                Referrer address
              </Text>
              <InputGroup size='md'>
                <Input
                  placeholder="Enter referrer's address here"
                  opacity='0.5'
                  h='50px'
                  borderRadius='6px'
                  name='referralDetail'
                  border='2px'
                  disabled={URLReferrerAddress !== ""}
                  value={referrerAddress}
                  onChange={(e) => setReferrerAddress(e.target.value)}
                />
              </InputGroup>
            </Box>}
           {showReferrerField && <Checkbox
              mt={3}
              onChange={handleSetReferralField}
              isChecked={isReferrerCheck}
              isDisabled={URLReferrerAddress !== ""}
            >
              No Referrer?
            </Checkbox>}
            <Flex mt={4}>

             {RGPBalance && <Box mr={2} mt={3}><Text color={modalTextColor2} fontSize="12px" >
                Fee :
              </Text>
              <Text color={modalTextColor}fontSize="16px">-{feeAmount}%</Text></Box>
              }
              {depositInputHasError || refAddressHasError ? (
                <>
                  {/* Show Error Button */}
                  <Button
                    my='2'
                    variant='brand'
                    mx='auto'
                    color={
                      depositValue === "Confirm" ||
                      depositValue === "Confirmed"
                        ? "rgba(190, 190, 190, 1)"
                        : "#40BAD5"
                    }
                    width='100%'
                    background={
                      depositValue === "Confirm" ||
                      depositValue === "Confirmed"
                        ? "rgba(64, 186, 213, 0.15)"
                        : "#444159"
                    }
                    disabled={
                      depositValue !== "Confirm" ||
                      !account ||
                      !depositTokenValue ||
                      (showReferrerField && referrerAddress === "")
                    }
                    cursor='pointer'
                    border='none'
                    borderRadius='0px'
                    padding='10px'
                    height='50px'
                    fontSize='16px'
                    _hover={
                      depositValue === "Confirm" ||
                      depositValue === "Confirmed"
                        ? { background: "rgba(64, 186, 213, 0.15)" }
                        : { background: "#444159" }
                    }
                    onClick={() => {}}
                  >
                    {depositErrorButtonText}
                  </Button>
                </>
              ) : (
                <>
                  {approveValueForRGP ? (
                    <Button
                      my='2'
                      mx='auto'
                      variant='brand'
                      width='100%'
                      disabled={
                        depositValue !== "Confirm" ||
                        !account ||
                        !depositTokenValue ||
                        (showReferrerField && referrerAddress === "")
                      }
                      cursor='pointer'
                      border='none'
                      borderRadius='0px'
                      padding='10px'
                      height='50px'
                      fontSize='16px'
                      _hover={
                        depositValue === "Confirm"
                          ? { background: "rgba(64, 186, 213, 0.15)" }
                          : { background: "#444159" }
                      }
                      onClick={() => confirmDeposit(deposit)}
                    >
                      {depositValue}
                    </Button>
                  ) : (
                    approvalButton(deposit)
                  )}
                </>
              )}
            </Flex>
            <Button
                        my='2'
                        mx='auto'
                        variant='brand'
                        width='100%'
                        cursor='pointer'
                        border='none'
                        borderRadius='0px'
                        padding='10px'
                        height='50px'
                        fontSize='16px'
                        onClick={closeDepositeModal}
                      >
                        Cancel
                      </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
}