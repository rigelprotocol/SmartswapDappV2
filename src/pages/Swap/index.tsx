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
import Test from "../../components/Modals/Test";


const App = () => {
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          <Heading>Swap page</Heading>
          <Button variant="brand"> Swap </Button>
          <Test />
        </VStack>
      </Grid>
    </Box>
  );
};

export default App;
