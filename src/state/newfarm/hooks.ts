import { State } from "../types";
import { farmDataInterface } from "./reducer";
import { useSelector } from "react-redux";

export const useFarmData = (): farmDataInterface => {
  const farms = useSelector((state: State) => state.newfarm);
  return farms;
};
