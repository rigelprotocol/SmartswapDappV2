import { State } from "../types";
import { farmDataInterface } from "./reducer";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { updateAllowance } from "./actions";
import { useGetFarmData } from "../../utils/hooks/useGetFarmData";
import { id } from "ethers/lib/utils";

export const useFarmData = (): farmDataInterface => {
  const farms = useSelector((state: State) => state.newfarm);
  return farms;
};

export const useUpdateArray = (data: any) => {
  //   const data = useFarmData();
  useMemo(() => {
    if (data !== undefined) {
      console.log(data);

      //   const index = data.contents?.findIndex((item) => item.id === 1);
      let newArray = [...data];
      //   //   newArray[0]["1"].poolAllowance = "1";
      //   newArray["1"].deposit = "A";
      console.log(newArray["1"]);
    }
  }, [data]);
};

export const useUpdate = (reload: boolean, setReload: any, address: string) => {
  const dispatch = useDispatch();

  //   const contents = data.contents;

  //   const updateArray = () => {
  //     const index = data.contents?.findIndex((item) => item.id === id);
  //     let newArray = [contents && contents];
  //     newArray["1"].poolAllowance = "1";
  //     console.log(newArray);
  //   };

  useMemo(() => {
    if (reload) {
      dispatch(
        updateAllowance({
          farmdata,
        })
      );
      console.log("reload");
      setReload(false);
      setId(undefined);
    }
  }, [reload]);
};
