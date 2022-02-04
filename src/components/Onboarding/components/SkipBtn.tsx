import { Text } from '@chakra-ui/react';
import React from 'react';

const SkipBtn = () => {
    return (
        <button>
            <Text
                py={3}
                decoration='underline'
                fontSize="16px"
                fontWeight="normal"
                color='white'>
                Skip</Text>
        </button>
    );
};

export default SkipBtn;
