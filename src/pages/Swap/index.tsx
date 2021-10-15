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
import ConfirmModal from "./modals/confirmModal";

const App = () => {
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          <Heading>Swap page</Heading>
          <ConfirmModal 
          title="Confirm Swap"
          from="RGP"
          fromPrice="17383"
          to="USDT"
          toDeposited="1.7383"
          fromDeposited="17383"
          minRecieved="12.7484"
          route={["RGP","BUSD","BNB"]}
          slippage="0.23"
          impact="0.45"
          fee="1.234"
          />
          <Button variant="brand"> Swap </Button>
        </VStack>
      </Grid>
    </Box>
  );
};

export default App;
