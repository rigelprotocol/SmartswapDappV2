import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {useSelector} from "react-redux";
import {RootState} from "../state";
import {SMARTBID1, SMARTBID2} from "../utils/addresses";
import {useEffect, useState} from "react";
import {RigelSmartBid, RigelSmartBidTwo} from "../utils/Contracts";
import {getERC20Token} from "../utils/utilsFunctions";
import {ethers} from "ethers";
import {formatAmount} from "../utils/hooks/useAccountHistory";




export const useSmartBid = (id: number) => {
    const {chainId, library, account} = useActiveWeb3React();


    const [bidTime, setBidTime] = useState(122200);
    const [loadData, setLoadData] = useState(false);

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged: boolean = trxState === 2;

    let validSmartAddress: string;
    if (SMARTBID1[chainId as number] !== "0x") {
        validSmartAddress = SMARTBID1[chainId as number];
    }

    useEffect(() => {
        setLoadData(true);

        const fetchBidData = async () => {
            if (chainId !== undefined) {
                try {
                    const bidContract = await RigelSmartBid(validSmartAddress, library);
                    const bidData = await bidContract.request_data_in_Bidding(id);
                    setBidTime(bidData.timeOut.toString());


                } catch (e) {
                    console.log(e)
                }
            }
        };
        fetchBidData();



    }, [account, chainId, stateChanged]);

    return {loadData, bidTime}
};


