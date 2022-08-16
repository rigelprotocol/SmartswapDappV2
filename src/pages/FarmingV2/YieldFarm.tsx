import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Img,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatAmount } from "../../utils/utilsFunctions";
import ShowYieldFarmDetails from "./ShowYieldFarmDetails";
import { DARK_THEME, farmSection, LIGHT_THEME } from "./index";
import { useWeb3React } from "@web3-react/core";
import Darklogo from "../../assets/rgpdarklogo.svg";
import { useLocation } from "react-router-dom";
import { GButtonClicked } from "../../components/G-analytics/gFarming";
import ShowNewFarm from "./ShowNewFarm";
import { useSelector } from "react-redux";
import { State } from "../../state/types";
import { SupportedChainId } from "../../constants/chains";
import { RootState } from "../../state";

const YieldFarm = ({
  content,
  content2,
  farmDataLoading,
  wallet,
  URLReferrerAddress,
  refreshSpecialData,
  LoadingState,
  section,
  contractID,
}: {
  content?: {
    pid: number;
    id: string;
    totalLiquidity: string;
    earn: string;
    img: string;
    ARYValue: string;
    lpSymbol: string;
    tokensStaked: string[];
    availableToken: string;
    deposit: string;
    poolAllowance: any;
    RGPEarned: string;
    poolVersion: number | string;
    type?: string;
  };
  farmDataLoading: boolean;
  content2?: {
    id: number | undefined;
    img: string;
    deposit: string;
    symbol0: string;
    symbol1: string;
    earn: string;
    totalLiquidity: number;
    LPLocked: number;
    APY: number;
    address: string;
    type?: string;
  };
  refreshSpecialData: () => void;
  wallet: any;
  URLReferrerAddress: string;
  LoadingState: boolean;
  section: string;
  contractID: number;
}) => {
  const mode = useColorModeValue(LIGHT_THEME, DARK_THEME);
  const { chainId, library } = useWeb3React();
  const active = chainId && library;
  const [showYieldfarm, setShowYieldFarm] = useState(false);
  const params = useLocation().pathname;
  const myRef = useRef(null);
  const ChainId = useSelector<RootState>((state) => state.chainId.chainId);

  const symbolName = params.split("/");

  const selectedField = useSelector(
    (state: State) => state.farming.selectedField
  );
  const selectedBSC = selectedField === farmSection.NEW_LP;
  const selected =
    selectedField === farmSection.NEW_LP ||
    selectedField === farmSection.SECOND_NEW_LP;

  // useEffect(() => {
  //   const getSingleFarm = async () => {
  //     await content2;
  //
  //     if (symbolName[2] === content2?.deposit) {
  //       myRef.current.scrollIntoView({behavior: 'smooth'});
  //       setShowYieldFarm(true)
  //     }
  //
  //   };
  //   getSingleFarm();
  //
  // }, [symbolName, params]);

  const totalLiquidityValue = () => {
    if (farmDataLoading) return <Spinner speed="0.65s" color="#333333" />;

    if (content.totalLiquidity) {
      return ` ${formatAmount(content.totalLiquidity)}`;
    }
  };

  // console.log(loading);

  return (
    <>
      <Flex
        ref={myRef}
        justifyContent="space-between"
        flexDirection={["column", "column", "row"]}
        border="1px solid #DEE5ED"
        background={
          mode === LIGHT_THEME
            ? "#FFFFFF !important"
            : mode === DARK_THEME
            ? "#15202B !important"
            : "#FFFFFF !important"
        }
        color={
          mode === LIGHT_THEME
            ? "#333333"
            : mode === DARK_THEME
            ? "#DCE5EF"
            : "#333333"
        }
        borderColor={
          mode === LIGHT_THEME
            ? "#F2F5F8 !important"
            : mode === DARK_THEME
            ? "#213345 !important"
            : "#F2F5F8 !important"
        }
        padding="15px 20px"
        width={["100%", "100%", "100%"]}
      >
        <Flex justifyContent="space-between" width="100%">
          <Box
            marginTop="15px"
            align="left"
            display={["block", "block", "none"]}
            opacity="0.5"
          >
            Deposit
          </Box>
          <Flex
            justifyContent={"space-between"}
            marginTop="15px"
            align="left"
            alignItems={"center"}
          >
            {content?.type === "RGP" ? content.deposit : content2?.deposit}
            {selectedBSC &&
            (Number(ChainId) === Number(SupportedChainId.BINANCETEST) ||
              Number(ChainId) === Number(SupportedChainId.BINANCE)) ? (
              <Img
                boxSize={"25px"}
                m={"10px"}
                src={
                  "https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png"
                }
              />
            ) : null}
            {selectedBSC &&
            (Number(ChainId) === Number(SupportedChainId.POLYGONTEST) ||
              Number(ChainId) === Number(SupportedChainId.POLYGON)) ? (
              <Img
                boxSize={"25px"}
                m={"10px"}
                src={
                  "https://s2.coinmarketcap.com/static/img/coins/64x64/8206.png"
                }
              />
            ) : null}
            {selectedField === farmSection.SECOND_NEW_LP ? (
              <Img
                boxSize={"25px"}
                m={"10px"}
                src={"https://bscscan.com/token/images/rigelprotocol_32.png"}
              />
            ) : null}
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" width="100%">
          <Box
            marginTop="15px"
            align="left"
            display={["block", "block", "none"]}
            opacity="0.5"
          >
            Earn
          </Box>
          <Flex
            justifyContent="space-between"
            marginTop="15px"
            paddingLeft="30px"
            // align='left'
            alignItems="center"
          >
            {/* <RGPIcon />  */}
            <Img w="24px" src={Darklogo} />{" "}
            <Text marginLeft="10px">
              {content?.type === "RGP" ? content.earn : content2?.earn}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" width="100%">
          <Box
            marginTop="15px"
            align="left"
            display={["block", "block", "none"]}
            opacity="0.5"
          >
            APY
          </Box>
          <Box marginTop="15px" paddingLeft="50px" align="left">
            {content?.type === "RGP"
              ? `${formatAmount(content.ARYValue)}%`
              : `${formatAmount(content2?.APY.toFixed(2))}%`}
          </Box>
        </Flex>
        <Flex
          justifyContent="space-between"
          width="100%"
          marginBottom={["10px", "10px", "0"]}
        >
          <Box
            marginTop="15px"
            align="left"
            display={["block", "block", "none"]}
            opacity="0.5"
          >
            Total Liquidity
          </Box>
          <Box
            marginTop="15px"
            paddingLeft="65px"
            align="right"
            alignItems="center"
          >
            ${" "}
            {content?.type === "RGP"
              ? totalLiquidityValue()
              : formatAmount(content2?.totalLiquidity.toFixed(2))}
          </Box>
        </Flex>
        {selected && (
          <Flex
            justifyContent="space-between"
            width="100%"
            marginBottom={["10px", "10px", "0"]}
          >
            <Box
              marginTop="15px"
              align="left"
              display={["block", "block", "none"]}
              opacity="0.5"
            >
              LP Locked
            </Box>
            <Box
              marginTop="15px"
              paddingLeft="65px"
              align="right"
              alignItems="center"
            >
              {content2?.LPLocked}
            </Box>
          </Flex>
        )}
        <Box align="right" mt={["4", "0"]} ml="2">
          <Button
            w={["100%", "100%", "146px"]}
            h="40px"
            border="2px solid #319EF6"
            background={
              mode === LIGHT_THEME && active
                ? "#FFFFFF !important"
                : mode === DARK_THEME && active
                ? "#319EF6 !important"
                : mode === LIGHT_THEME && !active
                ? "#FFFFFF !important"
                : mode === DARK_THEME && !active
                ? "#15202B !important"
                : "#FFFFFF !important"
            }
            color={
              mode === LIGHT_THEME && active
                ? "#319EF6"
                : mode === DARK_THEME && active
                ? "#FFFFFF"
                : mode === LIGHT_THEME && !active
                ? "#319EF6"
                : mode === DARK_THEME && !active
                ? "#4CAFFF"
                : "#333333"
            }
            borderColor={
              mode === LIGHT_THEME && active
                ? "#4CAFFF !important"
                : mode === DARK_THEME && active
                ? "#319EF6 !important"
                : mode === LIGHT_THEME && !active
                ? "#4CAFFF !important"
                : mode === DARK_THEME && !active
                ? "#4CAFFF !important"
                : "#319EF6 !important"
            }
            borderRadius="6px"
            mb="4"
            _hover={{ color: "#423a85" }}
            onClick={() => {
              if (!showYieldfarm) {
                GButtonClicked("unlock button", content?.deposit, "v2");
              }
              setShowYieldFarm(!showYieldfarm);
            }}
            className={"unlock"}
            disabled={!active}
          >
            Unlock
          </Button>
          {/* )} */}
        </Box>
      </Flex>
      {showYieldfarm &&
        (!selected ? (
          <ShowYieldFarmDetails
            content={content?.type === "RGP" ? content : content2}
            // content2={content2}
            LoadingState={LoadingState}
            section={section}
            refreshSpecialData={() => refreshSpecialData()}
            // content2={content2}
            // showYieldfarm={loading}
            wallet={wallet}
            URLReferrerAddress={URLReferrerAddress}
          />
        ) : (
          <ShowNewFarm
            content={content?.type === "RGP" ? content : content2}
            LoadingState={LoadingState}
            section={section}
            wallet={wallet}
            URLReferrerAddress={URLReferrerAddress}
            contractID={contractID}
          />
        ))}
    </>
  );
};

export default YieldFarm;
