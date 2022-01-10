import React from "react";
import { Box, Text, useColorModeValue, VStack } from "@chakra-ui/react";

interface DetailBoxProps {
  details:any[],
  inputDetails: string | undefined
}

const DetailBox = ({details,inputDetails}:DetailBoxProps) => {
  const textColor = useColorModeValue("#333333", "#F1F5F8");
  const borderColor = useColorModeValue("#DEE5ED", "#324D68");
  const secondaryText = useColorModeValue("#666666", "#DCE6EF");

  return (
    <Box
      border={`1px solid ${borderColor}`}
      borderRadius={"6px"}
      p={3}
      my={4}
      mx={3}
      textAlign={"center"}
    >
      <VStack>
        <Box>
          <Text color={secondaryText} fontSize={"14px"} my={"4px"}>
            Token Name
          </Text>
          <Text
            fontSize={"16px"}
            fontWeight={"400"}
            color={textColor}
            my={"4px"}
          >
            {details.length >= 1 && inputDetails !== '' ? details[0].name : details.length <= 1 && inputDetails !== '' ? inputDetails  : 'Rigel Protocol'}
          </Text>
        </Box>

        <Box my={"8px"}>
          <Text color={secondaryText} fontSize={"14px"} my={"4px"}>
            Token Amount
          </Text>
          <Text fontSize={"16px"} color={textColor} my={"4px"}>
            {details.length >= 1 && inputDetails !== '' ? details[0].supply : details.length <= 1 && inputDetails !== '' ? '' : '20,000,000'}
          </Text>
        </Box>

        <Box my={"8px"}>
          <Text color={secondaryText} fontSize={"14px"} my={"4px"}>
            Description
          </Text>
          <Text fontSize={"16px"} color={textColor} my={"4px"}>
            {details.length >= 1 && inputDetails !== '' ? details[0].description : details.length <= 1 && inputDetails !== '' ? '' : 'Rigel Protocol is a decentralized protocol of several DeFi products. RigelProtocol is completely considered, initiated, developed, and driven by the Rigelprotocol community.'}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default DetailBox;
