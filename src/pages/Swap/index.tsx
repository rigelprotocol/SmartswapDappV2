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
import ConfirmModal from "../AddLiquidity/modals/ConfirmModal";

const App = () => {
  const [show,setShow] = React.useState(true)
  
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          <Heading>Swap page</Heading>
          <Button variant="brand"> Swap </Button>
          <ConfirmModal 
            title="confirm"
            amount="3463"
            from="RGP"
            to="BUSD"
            fromPrice="0.5464"
            toPrice="1.3838"
            fromDeposited="7.3838"
            toDeposited="1.3838"
            poolShare="0.12"
            />
        </VStack>
      </Grid>
    </Box>
  );
};

export default App;
