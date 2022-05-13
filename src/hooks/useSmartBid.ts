import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {useSelector} from "react-redux";
import {RootState} from "../state";
import {RGPADDRESSES, SMARTBID1, SMARTBID2, SMARTSWAPNFTSALES} from "../utils/addresses";
import {useEffect, useState} from "react";
import {RigelNFT, RigelSmartBid, RigelSmartBidTwo} from "../utils/Contracts";
import {getERC20Token} from "../utils/utilsFunctions";
import {ethers} from "ethers";
import {formatAmount} from "../utils/hooks/useAccountHistory";




export const useSmartBid = (id: number) => {
    const {chainId, library, account} = useActiveWeb3React();


    const [bidTime, setBidTime] = useState(0);
    const [loadData, setLoadData] = useState(false);
    const [bidDetails, setBidDetails] = useState({initial: '', max: 0});

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged: boolean = trxState === 2;

    let validSmartAddress: string;
    if (SMARTBID2[chainId as number] !== "0x") {
        validSmartAddress = SMARTBID2[chainId as number];
    }

    useEffect(() => {
        setLoadData(true);

        const fetchBidData = async () => {
            if (chainId !== undefined) {
                try {
                    const bidContract = await RigelSmartBidTwo(validSmartAddress, library);
                    const bidData = await bidContract.request_data_in_Bidding(id);
                    setBidTime(bidData.timeOut.toString());
                    setBidDetails({initial : bidData.highestbid.toString(), max: Number(bidData.mustNotExceed.toString()) + Number(bidData.highestbid.toString())});

                    setLoadData(false);

                } catch (e) {
                    console.log(e);
                    setLoadData(false);
                }
            }
        };
        fetchBidData();



    }, [account, chainId, stateChanged]);

    return {loadData, bidTime, bidDetails}
};


export const useBidAllowance = (
    checkTokenApproval: number,
    amount: string,
    isOpen: boolean,
    id: number
) => {
    const { account, chainId, library } = useActiveWeb3React();
    const [hasTokenABeenApproved, setHasTokenABeenApproved] = useState(false);
    const [loadInfo, setLoadInfo] = useState(false);

    useEffect( () => {
        const getAllowance = async () => {
            if (account) {
                try {
                    setLoadInfo(true);

                    const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
                    const bidToken = await bidContract.requestToken(id);



                        const [tokenA] = await Promise.all([
                            getERC20Token(bidToken._token, library)
                        ]);

                        const [allowanceA, decimalsA] = await Promise.all([
                            tokenA.allowance(account, SMARTBID2[chainId as number]),
                            tokenA.decimals()
                        ]);

                        const isTokenAApproved = allowanceA.toString() > parseFloat(ethers.utils.formatUnits(amount, decimalsA).toString());
                        console.log(isTokenAApproved);

                        setHasTokenABeenApproved(isTokenAApproved);
                        setLoadInfo(false);

                } catch (e) {
                    console.log(e)
                }
            }
        };
        getAllowance();
    }, [checkTokenApproval, account, isOpen]);

    return { hasTokenABeenApproved, loadInfo };
};



