import { Text } from '@chakra-ui/react';
import React from 'react';


interface Props {
    children: React.ReactNode;
}

const TitleBox = ({ children }: Props) => (

    <Text pl={2} align='justify'>{children}</Text>

);

export default TitleBox;
