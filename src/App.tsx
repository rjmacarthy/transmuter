import React from "react";
import { Transmuter } from "./components/Transmuter";
import { ChakraProvider } from "@chakra-ui/react";

export const App = () => (
  <ChakraProvider>
    <Transmuter />
  </ChakraProvider>
);
