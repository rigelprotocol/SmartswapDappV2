// theme/index.js
import { extendTheme } from "@chakra-ui/react"
// Global style overrides
import styles from "./styles"
// Foundational style overrides
import borders from "./foundations/borders"
// Component style overrides
import Button from "./components/button"
const baseStylePopper = {
  w: "70px",
  maxW: "60px",
  zIndex: 10,
};
const overrides = {
    styles,
    borders,
    // Other foundational style overrides go here
    components: {
        Button,
        // Other components go here
        Popover: {
          parts: ['popper'],
          baseStyle: {
            popper: {
              width: 'fit-content',
              maxWidth: 'fit-content',
            },
          },
        },
          
    },
    fonts: {
        heading: "CeraProBold",
        body: "CeraProRegular",
    },
    colors: {
        brand: {
            100: "#319EF6",
        },
        darkBg: {
            100: "#213345",
        },
        lightBg: {
            100: "#EBF6FE",
            200: "#F2F5F8"
        },
        gray: {
            100: '#DCE6EF',
            200: '#666666'
        }
    },
};
export default extendTheme(overrides)