import { Text } from '@chakra-ui/react';
import React from 'react';

const SkipBtn = ({skipAllTours}:{
    skipAllTours?:()=>void
}) => {
    return (
        <button>
            <Text
                py={3}
                decoration='underline'
                fontSize="16px"
                onClick={skipAllTours}
                fontWeight="normal"
                color='white'>
                Skip</Text>
        </button>
    );
};

export default SkipBtn;
