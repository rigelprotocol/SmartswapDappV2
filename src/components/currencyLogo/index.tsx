import React, { FunctionComponent, useMemo } from "react";
import {
  SupportedChainSymbols,
  SupportedChainLogo,
} from "../../utils/constants/chains";
import { Currency, WETH9 } from "@uniswap/sdk-core";
import { WrappedTokenInfo } from "../../state/lists/WrappedTokenInfo";
import Logo from "../Logo";

import useHttpLocations from "../../utils/hooks/useHttpLocations";
import { WNATIVEADDRESSES } from "../../utils/addresses";

function getCurrencySymbol(currency) {
  if (currency.symbol === "WBTC") {
    return "btc";
  }
  if (currency.symbol === "WETH") {
    return "eth";
  }
  if (currency.symbol === "WBNB") {
    return "bnb";
  }
  try {
    return currency.symbol.toLowerCase();
  } catch (e) {
    return "";
  }
}
const BLOCKCHAIN = {
  [1]: "mainnet",
  [97]: "bsc",
  [56]: "bsc-testnet",
  [137]: "matic",
  // [ChainId.OKEX]: 'okex',
};
export function getCurrencyLogoUrls(currency) {
  const urls = [];
  urls.push(
    `https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/${getCurrencySymbol(
      currency
    )}.jpg`
  );
  if (currency.chainId in SupportedChainSymbols) {
    urls.push(
      `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${SupportedChainSymbols[currency.chainId]
      }/assets/${currency.address}/logo.png`
    );
    urls.push(
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${SupportedChainSymbols[currency.chainId]
      }/assets/${currency.address}/logo.png`
    );
    urls.push(
      `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${currency.address}/logo.png`
    );
  }
  return urls;
}

const BinanceCoinLogo =
  "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/bnb.jpg";
const EthereumLogo =
  "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/eth.jpg";
const LOGO = SupportedChainLogo;

interface CurrencyLogoProps {
  currency?: Currency;
  size?: string | number;
  className?: string;
  squared?: boolean;
  marginBottom?: number;
  marginRight?: number;
}
const unknown =
  "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/unknown.png";
// const unknown = NULL24LOGO

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({
  currency,
  size = "24px",
  className = "",
  squared,
  marginBottom,
  marginRight,
  ...rest
}) => {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo
      ? currency.logoURI || currency.tokenInfo.logoURI
      : undefined
  );
  const srcs: string[] = useMemo(() => {
    if (!currency) {
      return [];
    }
    try {
      if (
        currency?.address === WNATIVEADDRESSES[currency.chainId] ||
        currency.isNative ||
        (currency.symbol === "WETH" && currency.equals(WETH9[currency.chainId]))
      ) {
        return [LOGO[currency.chainId], unknown];
      } else if (currency.isToken && currency.symbol === "RGP") {
        return ["https://bscscan.com/token/images/rigelprotocol_32.png"];
      } else if (currency.isToken && currency.symbol === "WARS") {
        return ["https://s2.coinmarketcap.com/static/img/coins/64x64/13105.png"];
      } else if (currency.logoURI) {
        return [currency.logoURI]
      }
    } catch (e) {
      console.log("cannot read property chainID");
    }

    if (currency.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency)];
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls, unknown];
      }
      return defaultUrls;
    }
    return [];
  }, [currency, uriLocations]);

  return (
    <Logo
      srcs={srcs}
      width={size}
      height={size}
      alt={currency?.symbol}
      squared={squared}
      {...rest}
      mb={marginBottom}
      mr={marginRight}
    />
  );
};

export default React.memo(CurrencyLogo);
