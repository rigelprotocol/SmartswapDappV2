
const buttons = {

    variants: {

        brand: {
            bg: "#319EF6",
            color: "white",
            boxShadow: "md",
            loadingText: "Submitting",
            transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
            _hover: {
                bg: "blue.500",
            },
            _active: {
                bg: "blue.600",
                transform: "scale(0.98)",
                borderColor: "blue.500",
            },
            _focus: {
                boxShadow:
                    "0px 1px 7px rgba(41, 45, 50, 0.08)",
            }

        },
        rgpButton: {
            bg: "#EBF6FE",
            color: "#319EF6",
            _hover: {
                bg: "blue.500",
                color: '#EBF6FE'
            }

        }
    }
};
export default buttons;