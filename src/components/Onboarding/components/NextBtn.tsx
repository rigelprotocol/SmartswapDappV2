import { Button, useColorModeValue } from '@chakra-ui/react';
import React from 'react';


const NextBtn = () => {
    const bgColor = useColorModeValue("#319EF6", "#4CAFFF");
    return (
        <>

            <Button background='white' variant='brand' color={bgColor}>
                Next
            </Button>
        </>
    );
};

export default NextBtn;
