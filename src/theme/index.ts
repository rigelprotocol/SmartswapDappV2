// theme/index.js
import { extendTheme } from "@chakra-ui/react"
// Global style overrides
import styles from "./styles"
// Foundational style overrides
import borders from "./foundations/borders"
// Component style overrides
import Button from "./components/button"
const overrides = {
    styles,
    borders,
    // Other foundational style overrides go here
    components: {
        Button,
        // Other components go here
    },
    fonts: {
        heading: "CeraProBold",
        body: "CeraProRegular",
    },
    colors: {
        brand: {
            100: "#319EF6",
        },
    },
}
export default extendTheme(overrides)