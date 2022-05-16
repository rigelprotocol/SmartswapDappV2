import React from 'react'
import {
    InputGroup,
    Input,
    InputRightAddon,
    useColorModeValue,
} from '@chakra-ui/react'
import { Currency } from '@uniswap/sdk';

interface CProps {
    initialFromPrice: string,
    currency?: Currency,
    setInitialPrice: Function,
    placeholder:string,
    shakeInput:boolean,
    showButton:boolean
}

const CInput: React.FC<CProps> = ({
    initialFromPrice,
    currency,
    setInitialPrice,
    placeholder,
    shakeInput,
    showButton
}) => {

    const tokenListTrgiggerBgColor = useColorModeValue('', '#FFFFFF');
    const background = useColorModeValue('#319df6b5', '#319df6b5');
    return (
        <>
        
        <InputGroup size='sm' width="250px">
            
            <Input placeholder={placeholder} height="40px" value={initialFromPrice} onChange={(e) => setInitialPrice(e.target.value)} 
            background={shakeInput ? background: "transparent"}
            />
            <InputRightAddon children={(currency?.symbol && currency?.symbol && currency?.symbol.length > 4
                ? currency?.symbol.slice(0, 4) +
                '...'
                : currency?.symbol) || ""} height="40px" color={tokenListTrgiggerBgColor} />
        </InputGroup>
        </>
        
    )
}

export default CInput