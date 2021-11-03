import BSC_TEST_TOKEN_LIST from "../../components/Tokens/tokens/BSC-testnet.json"
import BSC_MAIN_TOKEN_LIST from "../../components/Tokens/tokens/BSC-mainnet.json"
import ETHEREUM_TOKEN_LIST from "../../components/Tokens/tokens/ethereum.json"
import POLYGON_TEST_TOKEN_LIST from "../../components/Tokens/tokens/polygon-testnet.json"
import POLYGON_MAIN_TOKEN_LIST from "../../components/Tokens/tokens/polygon-mainnet.json"
import RINKEBY_TOKEN_LIST from "../../components/Tokens/tokens/rinkeby.json"
import { Currency } from '../../components/Tokens/SelectToken';
import {tokens} from "@rigelprotocol_01/default-token-list"

console.log({tokens})
export const defaultTokenList : {[key:string]:Currency[]} = {
    '1': ETHEREUM_TOKEN_LIST,
    '4': RINKEBY_TOKEN_LIST,
    '56': BSC_MAIN_TOKEN_LIST,
    '97': BSC_TEST_TOKEN_LIST,
    '137': POLYGON_MAIN_TOKEN_LIST,
    '80001': POLYGON_TEST_TOKEN_LIST,
}
