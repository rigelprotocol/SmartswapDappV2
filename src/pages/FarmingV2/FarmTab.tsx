import {
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Tab,
  TabList,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import Filter from "../../components/Farming/Modals/Filter";
import { SearchIcon } from "@chakra-ui/icons";
import React from "react";

interface FarmTabProps {
  oldestToNewest: boolean;
  setOldestToNewset: React.Dispatch<React.SetStateAction<boolean>>;
  setNewestToOldest: React.Dispatch<React.SetStateAction<boolean>>;
  newestToOldest: boolean;
  range0: string | number;
  range1: string | number;
  setRange0: React.Dispatch<React.SetStateAction<string | number>>;
  setRange1: React.Dispatch<React.SetStateAction<string | number>>;
  FilterFarm: () => void;
  showPopOver: boolean;
  setShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  setSavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  tabOneName?: string | null;
  tabTwoName?: string | null;
  setKeyword: (key: string) => void;
}

const FarmTab = ({
  oldestToNewest,
  setOldestToNewset,
  setNewestToOldest,
  newestToOldest,
  range0,
  range1,
  setRange0,
  setRange1,
  FilterFarm,
  showPopOver,
  setShowPopover,
  setSavedChanges,
  tabOneName,
  tabTwoName,
  setKeyword,
}: FarmTabProps) => {
  const [isMobileDevice] = useMediaQuery("(max-width: 750px)");
  const filterBorderColor = useColorModeValue("#DEE5ED", "#324D68");
  const placeholderTextColor = useColorModeValue("#333333", "#DCE5EF");
  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"} mt={10}>
        <TabList
          mb="1em"
          border={"1px solid #DEE6ED"}
          p={"6px"}
          borderRadius={"6px"}
          w={isMobileDevice ? "100%" : "25%"}
        >
          {tabOneName && (
            <Tab
              _selected={{
                color: "white",
                bg: "#319EF6",
                borderRadius: "4px",
              }}
            >
              {tabOneName}
            </Tab>
          )}
          {tabTwoName && (
            <Tab
              _selected={{
                color: "white",
                bg: "#319EF6",
                borderRadius: "4px",
              }}
            >
              {tabTwoName}
            </Tab>
          )}
        </TabList>
        <Flex
          ml={5}
          display={isMobileDevice ? "none" : undefined}
          justifyContent="space-between"
        >
          <Filter
            oldestToNewest={oldestToNewest}
            setOldestToNewset={setOldestToNewset}
            setNewestToOldest={setNewestToOldest}
            newestToOldest={newestToOldest}
            range0={range0}
            range1={range1}
            setRange0={setRange0}
            setRange1={setRange1}
            FilterFarm={() => FilterFarm()}
            showPopover={showPopOver}
            setShowPopover={setShowPopover}
            setSavedChanges={setSavedChanges}
          />

          <InputGroup w="80%" mx={"10px"}>
            <InputLeftAddon
              bgColor="transparent"
              borderColor={filterBorderColor}
              w="2%"
              children={<SearchIcon mr={4} />}
            />
            <Input
              textAlign="left"
              fontSize="14px"
              placeholder="Search for farms"
              _placeholder={{ color: placeholderTextColor }}
              onChange={(e) => {
                const formattedValue = e.target.value.toUpperCase();
                setKeyword(formattedValue);
              }}
              borderLeft={0}
              borderColor={filterBorderColor}
              _focus={{ borderColor: "none" }}
            />
          </InputGroup>
        </Flex>
      </Flex>
    </>
  );
};

export default FarmTab;
