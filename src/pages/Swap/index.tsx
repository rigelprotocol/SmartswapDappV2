import * as React from "react";
import {
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Button,
  Heading,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./../../components/ColorModeSwitcher";
import toast from 'react-hot-toast';
import Toast from "../../components/Toast";

const App = () => {

  const buttonClick = (message: string) => {
    toast.custom(<Toast message={message} URL={'google.com'}/>)
  };

  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          <Heading>Swap page</Heading>
          <Button variant="brand" >Swap </Button>
          <Button variant="brand" onClick={() => buttonClick('Swapped 4.32221 RGP for 2.3455 USDT')} >Add Toast </Button>
        </VStack>
      </Grid>
    </Box>
  );
};

export default App;
