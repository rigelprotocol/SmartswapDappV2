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

const App = () => {
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VStack spacing={8}>
          <Heading>Swap page</Heading>
          <Button variant="brand"> Swap </Button>

          <Link
            href="#"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Smartswap
          </Link>
        </VStack>
      </Grid>
    </Box>
  );
};

export default App;
