import { Button, useColorModeValue } from '@chakra-ui/react';
import React from 'react';


const DoneBtn = () => {
    const bgColor = useColorModeValue("#319EF6", "#4CAFFF");
    return (
        <>

            <Button background='white' variant='brand' color={bgColor}>
                Done
            </Button>
        </>
    );
};

export default DoneBtn;
