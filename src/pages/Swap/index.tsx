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
import WalletModal from "../../components/Navbar/modals/walletModal";

const App = () => {
  const [show,setShow] = React.useState(true)
  
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          <Heading>Swap page</Heading>
          <Button variant="brand"> Swap </Button>
          <WalletModal />
        </VStack>
      </Grid>
    </Box>
  );
};

export default App;
