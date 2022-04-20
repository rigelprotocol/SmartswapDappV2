import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSearchResult,
  clearSearchResult,
  updateFilterResult,
  clearAllFarms,
} from "./action";
import { useFarms } from "../farm/hooks";
import { useFarmData } from "../newfarm/hooks";
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React";
import { useWeb3React } from "@web3-react/core";

interface FilterFarms {
  newestToOldest: boolean;
  min: number;
  max: number;
  setSavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  saveChanges: boolean;
}

export const useSearch = () => {
  const farms = useSelector((state: State) => state.farming.filterResult);
  return farms;
};

export const useSearchResults = () => {
  const farms = useSelector((state: State) => state.farming);
  return farms;
};

export const useFilterFarms = ({
  newestToOldest,
  min,
  max,
  setSavedChanges,
  saveChanges,
}: FilterFarms) => {
  const farmData = useFarms();
  const farms = useFarmData();
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch();

  const handleUpdateSearch = useCallback(
    (searchResult) => {
      dispatch(
        updateFilterResult({
          farmData: searchResult,
        })
      );
    },
    [dispatch]
  );

  useMemo(() => {
    if (!newestToOldest && saveChanges) {
      let dataArray = [...farms?.contents];

      const arrayLength = dataArray.length;
      // const firstItem = dataArray.splice(0, 1);
      // const lastItem = dataArray.splice(
      //   chainId === 80001 ||
      //     chainId === 137 ||
      //     chainId === 42261 ||
      //     chainId === 42262
      //     ? 3
      //     : arrayLength - 2,
      //   chainId === 80001 ||
      //     chainId === 137 ||
      //     chainId === 42261 ||
      //     chainId === 42262
      //     ? 10
      //     : 1
      // );

      console.log(dataArray);

      const searchResult = dataArray.filter(
        (item, idx) => item.APY > min && item.APY < max
      );
      const editSearch = [...searchResult];
      console.log(editSearch);

      handleUpdateSearch(editSearch);
      setSavedChanges(false);
    } else if (newestToOldest && saveChanges) {
      let dataArray = [...farms.contents];

      let normal = [...farmData.contents];
      let resortedArray = dataArray.reverse();
      const arrayLength = dataArray.length;
      // const firstItem = dataArray.splice(
      //   0,
      //   chainId === 80001 ||
      //     chainId === 137 ||
      //     chainId === 42261 ||
      //     chainId === 42262
      //     ? 9
      //     : 1
      // );
      // const lastItem = dataArray.splice(dataArray.length - 1, 1);
      const searchResult = dataArray.filter(
        (item) => item.APY > min && item.APY < max
      );
      const editSearch = [...searchResult];

      handleUpdateSearch(editSearch);
      setSavedChanges(false);
    }
  }, [newestToOldest, saveChanges]);
};

interface Args {
  keyword: string;
  previousKeyword: string;
  searchData: [];
}

export const useFarmSearch = ({
  keyword,
  previousKeyword,
  searchData,
}: Args) => {
  const FarmData = useFarms();
  const farms = useFarmData();
  const [searchedDataResult, setSearchedDataResult] = useState(undefined);
  const dispatch = useDispatch();
  const { chainId } = useActiveWeb3React();
  //   const searchData = useSearch();

  const handleUpdateSearch = useCallback(
    (searchResult) => {
      dispatch(
        updateSearchResult({
          farmData: searchResult,
        })
      );
    },
    [dispatch]
  );

  const clearResult = useCallback(() => {
    dispatch(clearSearchResult());
  }, [dispatch]);

  useMemo(() => {
    if (keyword) {
      let word = keyword.split("-");

      if (searchData) {
        let searchResultArray = [];

        const dataArray = [...searchData];
        const resultArray = dataArray.filter(
          (item) => item.deposit.search(keyword) !== -1
        );
        const secondResultSearch =
          word.length >= 2 && resultArray.length === 0
            ? dataArray.filter(
                (item) => item.deposit.search(word[1] + "-" + word[0]) !== -1
              )
            : undefined;

        if (resultArray.length !== 0) {
          searchResultArray.push(resultArray);
        } else {
          searchResultArray.push(secondResultSearch);
        }
        setSearchedDataResult(searchResultArray[0]);

        // handleUpdateSearch(searchResultArray[0]);
      } else if (farms.contents) {
        let searchResultArray = [];
        const dataArray = [...farms.contents];
        const arrayLength = dataArray.length;
        // const firstItem = dataArray.splice(0, 1);
        // const lastItem = dataArray.splice(
        //   chainId === 80001 ||
        //     chainId === 137 ||
        //     chainId === 42261 ||
        //     chainId === 42262
        //     ? 3
        //     : arrayLength - 2,
        //   chainId === 80001 ||
        //     chainId === 137 ||
        //     chainId === 42261 ||
        //     chainId === 42262
        //     ? 10
        //     : 1
        // );
        const resultArray = dataArray.filter(
          (item) => item.deposit.search(keyword) !== -1
        );
        const secondResultSearch =
          word.length >= 2 && resultArray.length === 0
            ? dataArray.filter(
                (item) => item.deposit.search(word[1] + "-" + word[0]) !== -1
              )
            : undefined;

        if (resultArray.length !== 0) {
          searchResultArray.push(resultArray);
        } else {
          searchResultArray.push(secondResultSearch);
        }
        console.log("farms", farms);
        setSearchedDataResult(searchResultArray[0]);
      }
    } else {
      setSearchedDataResult(undefined);
    }
  }, [keyword, searchData]);

  return [searchedDataResult];
};

export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

export const useClearFarm = () => {
  const data = useFarmData();
  const { chainId } = useWeb3React();
  const dispatch = useDispatch();

  const handleUpdateFarms = useCallback(() => {
    dispatch(clearAllFarms());
  }, [dispatch]);

  useMemo(() => {
    if (chainId !== data.chainId) {
      handleUpdateFarms();
    }
  }, [chainId]);
};
