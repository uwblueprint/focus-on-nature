import { extendTheme } from "@chakra-ui/react";
import "@fontsource/noto-sans";

import colors from "./colors";
import Button from "./components/Button";
// import Button from "./components/Button";
// import Container from "./components/Container";
// import Input from "./components/Input";
import textStyles from "./textStyles";

const customTheme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "background.grey.100",
      },
    }),
  },
  fonts: {
    heading: `'Noto Sans', sans-serif`,
    body: `'Noto Sans', sans-serif`,
  },
  textStyles,
  colors,
  //   breakpoints: {
  //     sm: "320px",
  //     md: "768px",
  //     lg: "960px",
  //   },
  components: {
    Button,
    // Steps,
    // Container,
    // Input,
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
