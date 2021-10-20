import React, {useEffect} from "react";
import {
    Box,
    IconButton, Flex, Text, useColorModeValue, VStack, HStack, Link
} from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {AiOutlineCheckCircle} from 'react-icons/ai';
import {RootState} from "../../state";
import {removeToast} from './toastSlice';
import {animated, useSpring} from 'react-spring';
import './toast.css';

export interface ToastProps {
    message: string,
    URL: string,
    remove: Function
}


function Toast({message, URL, remove }: ToastProps) {
    const bgColor3 = useColorModeValue( "#DEE6ED", "#324d68");
    const buttonBorder = useColorModeValue("gray.200", "gray.100");
    const successIcon = useColorModeValue('#22bb33', '#75f083');
    const bg = useColorModeValue('#fff', '#15202b');
    const shadow = useColorModeValue('0px 1px 7px rgba(41, 45, 50, 0.08)', '0px 2px 4px -2px rgba(178, 193, 230, 0.12), 0px 4px 4px -2px rgba(178, 193, 230, 0.08)');

    const faderStyle = useSpring({
        from: { width: '100%' },
        to: { width: '0%' },
        config: { duration: 3000 },
    });

    useEffect(() => {
        setTimeout(() => {
            remove()
        }, 3000)
    }, []);

    return (
        <Box height={'140px'} background={bg}
             width={'350px'} borderRadius={'6px'}
             boxShadow={shadow}
             border={'1px solid'} position={"relative"} borderColor={bgColor3} justifyContent={'center'}>
            <Flex h={'100%'}>
                <Box flex={'1'}>
                    <HStack h={'100%'} p={3} w={'90%'}>
                        <AiOutlineCheckCircle color={successIcon} size={'30px'}/>
                        <VStack alignItems={"start"} textAlign={'start'} px={'10px'}>
                            <Text fontSize={'16px'} fontWeight={'bold'}>{message}</Text>
                            <Link href={`https://${URL}`} isExternal variant={'link'} color={'brand.200'}>View on Etherscan</Link>

                        </VStack>
                    </HStack>
                </Box>
            </Flex>
            <IconButton
                icon={<CloseIcon />}
                onClick={() => remove()}
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
            <animated.div className={'progress'} style={faderStyle}/>
        </Box>
    );
}

export const Notify = () => {
    const toastDetails = useSelector((state: RootState) => state.toast);
    const dispatch = useDispatch();

    return (
        <Box position={'fixed'} mt={'20px'} right={'50px'} zIndex={'1000'}>
            {toastDetails.message && <Toast message={toastDetails.message} URL={toastDetails.URL} remove={() => dispatch(removeToast())}/>}
        </Box>
    )
};

export default Notify;