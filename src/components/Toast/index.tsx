import React from "react";
import {
    Box,
    IconButton, Flex, Text, useColorModeValue, VStack, Image, HStack, Progress, Link
} from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons';
import Tick from '../../assets/tick-circle.svg';
import TickLight from '../../assets/tick-circle-light.svg';
import toast from 'react-hot-toast';

export interface ToastProps {
    message: string,
    URL: string
}


function Toast({message, URL }: ToastProps) {
    const bgColor3 = useColorModeValue( "#DEE6ED", "#324d68");
    const buttonBorder = useColorModeValue("gray.200", "gray.100");
    const successImage = useColorModeValue(TickLight, Tick);

    return (
        <Box height={'140px'}
             width={'350px'} borderRadius={'6px'}
             border={'1px solid'} position={"relative"} borderColor={bgColor3} justifyContent={'center'}>
            <Flex h={'100%'}>
                <Box flex={'1'}>
                    <HStack h={'100%'} p={3} w={'90%'}>
                        <Image src={successImage} boxSize={'25px'} />
                        <VStack alignItems={"start"} textAlign={'start'} px={'10px'}>
                            <Text fontSize={'16px'} fontWeight={'bold'}>{message}</Text>
                            <Link href={`https://${URL}`} isExternal variant={'link'} color={'brand.200'}>View on Etherscan</Link>

                        </VStack>
                    </HStack>
                </Box>
            </Flex>
            <IconButton
                icon={<CloseIcon />}
                onClick={() => toast.dismiss()}
                aria-label={'Close Toast'}
                backgroundColor="transparent"
                position={'absolute'}
                top={'16px'}
                right={'16px'}
                bg="none"
                size={'xs'}
                cursor="pointer"
                _focus={{ outline: 'none' }}
                p={'7px'}
                border={'1px solid'}
                borderColor={buttonBorder}

            />
            <Progress position={'absolute'} borderRadius={'0px 0px 6px 6px'}
                      bottom={'0px'} size={'sm'} width={'100%'} bg={'brand.100'} borderColor="brand.100" isIndeterminate />
        </Box>
    );
}

export default Toast;