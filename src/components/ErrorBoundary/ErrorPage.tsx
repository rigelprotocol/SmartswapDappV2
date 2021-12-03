import React from "react";
import { VStack, Heading, Text } from "@chakra-ui/react";

function ErrorPage() {
  return (
    <VStack minH="80vh" align="center" justify="center">
      <Heading>Something went wrong...</Heading>
      <Text>Try reloading the page</Text>
    </VStack>
  );
}

export default ErrorPage;
