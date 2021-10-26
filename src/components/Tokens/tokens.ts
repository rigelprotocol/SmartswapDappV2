import USDTLOGO from '../../assets/roundedlogo.svg';
import BSC_TEST_TOKEN_LIST from "./tokens/BSC-testnet.json"
import BSC_MAIN_TOKEN_LIST from "./tokens/BSC-mainnet.json"
import ETHEREUM_TOKEN_LIST from "./tokens/ethereum.json"
import POLYGON_TEST_TOKEN_LIST from "./tokens/polygon-testnet.json"
import POLYGON_MAIN_TOKEN_LIST from "./tokens/polygon-mainnet.json"
import RINKEBY_TOKEN_LIST from "./tokens/rinkeby.json"
export const arr = [
    {
        symbol:"RGP",
        name:"RigelCoin",
        balance:"4.5554",
        img:USDTLOGO,
        imported:true
    },
]
export const defaultTokenList = BSC_TEST_TOKEN_LIST
console.log({defaultTokenList})