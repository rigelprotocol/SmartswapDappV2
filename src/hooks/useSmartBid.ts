import {useActiveWeb3React} from "../utils/hooks/useActiveWeb3React";
import {useSelector} from "react-redux";
import {RootState} from "../state";
import { SMARTBID1, SMARTBID2} from "../utils/addresses";
import {useEffect} from "react";
import {RigelSmartBid, RigelSmartBidTwo} from "../utils/Contracts";
import {getERC20Token, useProvider} from "../utils/utilsFunctions";
import {ethers} from "ethers";
import {SmartBidWinners} from "../pages/SmartBid/Components/cardData";
import useState from "react-usestateref";


export const useSmartBid = (id: number, exclusive: boolean) => {
    const {library, account} = useActiveWeb3React();


    const [bidTime, setBidTime] = useState(0);
    const [loadData, setLoadData] = useState(false);
    const [bidDetails, setBidDetails] = useState({initial: '', max: 0});
    const [addresses, setAddresses] = useState(3);
    const [rewardArray, setRewardArray] = useState<string[]>([]);
    const [totalBid, setTotalBid] = useState('');

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged: boolean = trxState === 2;
    const ChainId = useSelector<RootState>((state) => state.chainId.chainId);
    const {prov} = useProvider();

    useEffect(() => {
        setLoadData(true);
        const lib = library ? library : prov;

        const fetchBidData = async () => {
            if (exclusive) {
                if (ChainId !== undefined) {
                    try {
                        const bidContract = await RigelSmartBid(SMARTBID1[ChainId as number], lib);
                        const bidData = await bidContract.request_data_in_Bidding(id);
                        setBidTime(bidData.timeOut.toString());
                        setAddresses(bidData.numberOfRandomAddress.toString());
                        const maxOutput =  Number(bidData.highestbid.toString()) !== 0 ?
                            Number(bidData.mustNotExceed.toString()) + Number(bidData.highestbid.toString())
                            : Number(bidData.mustNotExceed.toString()) + Number(bidData.initiialBiddingAmount.toString());

                        setBidDetails({initial : Number(bidData.highestbid.toString()) !== 0 ? bidData.highestbid.toString()
                                : bidData.initiialBiddingAmount.toString(), max: maxOutput});

                        setTotalBid(bidData.totalBidding.toString());

                        setRewardArray([bidData.positionOneSharedPercentage.toString(), bidData.positionTwoSharedPercentage.toString(),
                            bidData.positionThreeSharedPercentage.toString(), bidData.randomUserSharedPercentage.toString()]);

                        setLoadData(false);

                    } catch (e) {
                        console.log(e);
                        setLoadData(false);
                    }
                }
            } else {
                if (ChainId !== undefined) {
                    try {
                        const bidContract = await RigelSmartBidTwo(SMARTBID2[ChainId as number], lib);
                        const bidData = await bidContract.request_data_in_Bidding(id);
                        setBidTime(bidData.timeOut.toString());
                        setAddresses(bidData.numberOfRandomAddress.toString());
                        const maxOutput =  Number(bidData.highestbid.toString()) !== 0 ?
                            Number(bidData.mustNotExceed.toString()) + Number(bidData.highestbid.toString())
                            : Number(bidData.mustNotExceed.toString()) + Number(bidData.initiialBiddingAmount.toString());
                        setBidDetails({initial : Number(bidData.highestbid.toString()) !== 0 ? bidData.highestbid.toString()
                                : bidData.initiialBiddingAmount.toString(), max: maxOutput});

                        setTotalBid(bidData.totalBidding.toString());

                        setRewardArray([ethers.utils.formatUnits(bidData.positionOneSharedPercentage.toString(),  18), ethers.utils.formatUnits(bidData.positionTwoSharedPercentage.toString(),  18),
                            ethers.utils.formatUnits(bidData.positionThreeSharedPercentage.toString(),  18), ethers.utils.formatUnits(bidData.randomUserSharedPercentage.toString(),  18)]);

                        setLoadData(false);

                    } catch (e) {
                        console.log(e);
                        setLoadData(false);
                    }
                }
            }

        };
        fetchBidData();

    }, [account, ChainId, stateChanged, library]);

    return {loadData, bidTime, bidDetails, addresses, rewardArray, totalBid}
};


export const useBidAllowance = (
    checkTokenApproval: number,
    amount: string,
    isOpen: boolean,
    id: number,
    exclusive: boolean
) => {
    const { account, chainId, library } = useActiveWeb3React();
    const [hasTokenABeenApproved, setHasTokenABeenApproved] = useState(false);
    const [loadInfo, setLoadInfo] = useState(false);

    useEffect( () => {
        const getAllowance = async () => {
            if (account) {
                if (exclusive) {
                    try {
                        setLoadInfo(true);

                        const bidContract = await RigelSmartBid(SMARTBID1[chainId as number], library);
                        const bidToken = await bidContract.request_token_info(id);

                        const [tokenA] = await Promise.all([
                            getERC20Token(bidToken.token, library)
                        ]);

                        const [allowanceA] = await Promise.all([
                            tokenA.allowance(account, SMARTBID1[chainId as number])
                        ]);

                        const isTokenAApproved = allowanceA.toString() > parseFloat(amount.toString());

                        setHasTokenABeenApproved(isTokenAApproved);
                        setLoadInfo(false);

                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    try {
                        setLoadInfo(true);

                        const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
                        const bidToken = await bidContract.requestToken(id);

                        const [tokenA] = await Promise.all([
                            getERC20Token(bidToken._token, library)
                        ]);

                        const [allowanceA] = await Promise.all([
                            tokenA.allowance(account, SMARTBID2[chainId as number])
                        ]);

                        const isTokenAApproved = allowanceA.toString() > parseFloat(amount.toString());

                        setHasTokenABeenApproved(isTokenAApproved);
                        setLoadInfo(false);

                    } catch (e) {
                        console.log(e)
                    }
                }

            }
        };
        getAllowance();
    }, [checkTokenApproval, account, isOpen]);

    return { hasTokenABeenApproved, loadInfo };
};


interface WinnerData {
    id: number,
    colors: string[],
    price: number | string,
    address: string
}


export const useBidWinners = (id: number, exclusive: boolean) => {
    const {chainId, library, account} = useActiveWeb3React();


    const [loadWinners, setLoadWinners] = useState(false);
    const [rewardArray, setRewardArray, setRewardArrayRef] = useState<string[]>(  []);
    const [totalBid, setTotalBid] = useState('');
    const [winnerDetails, setWinnerDetails] = useState<Array<WinnerData>>(SmartBidWinners);
    const [topBidders, setTopBidders] = useState<string[]>([]);

    const trxState = useSelector<RootState>((state) => state.application.modal?.trxState);
    const stateChanged: boolean = trxState === 2;


    useEffect(() => {
        setLoadWinners(true);

        const fetchBidWinners = async () => {
            if (exclusive) {
                if (chainId !== undefined) {
                    try {
                        const bidContract = await RigelSmartBid(SMARTBID1[chainId as number], library);
                        const bidders = await bidContract.projID(id);

                        if (Number(bidders.toString()) > 2) {
                            const winnersList = await bidContract.Top3Bidders(id);
                            setTopBidders(winnersList);

                            winnerDetails[0].address = winnersList[0];
                            winnerDetails[1].address = winnersList[1];
                            winnerDetails[2].address = winnersList[2];

                            const bidData = await bidContract.request_data_in_Bidding(id);
                            setTotalBid(bidData.totalBidding.toString());

                            setRewardArray([bidData.positionOneSharedPercentage.toString(), bidData.positionTwoSharedPercentage.toString(),
                                bidData.positionThreeSharedPercentage.toString(), bidData.randomUserSharedPercentage.toString()]);

                            const firstPrize = Number(setRewardArrayRef.current[0])/100 * Number(bidData.totalBidding.toString());
                            const secondPrize = Number(setRewardArrayRef.current[1])/100 * Number(bidData.totalBidding.toString());
                            const thirdPrize = Number(setRewardArrayRef.current[2])/100 * Number(bidData.totalBidding.toString());

                            winnerDetails[0].price = ethers.utils.formatUnits(firstPrize.toString(),  18);
                            winnerDetails[1].price = ethers.utils.formatUnits(secondPrize.toString(),  18);
                            winnerDetails[2].price = ethers.utils.formatUnits(thirdPrize.toString(),  18);
                        } else {
                            const winnersInfo = await bidContract.getTopBid(id);

                            const bidData = await bidContract.request_data_in_Bidding(id);
                            setTotalBid(bidData.totalBidding.toString());

                            const percent = ethers.utils.formatUnits(bidData.positionOneSharedPercentage.toString(),  18);
                            const total = ethers.utils.formatUnits(bidData.totalBidding.toString(),  18);

                            const price = Number(percent)/100 * Number(total);

                            setWinnerDetails([{id: 1, address: winnersInfo[0],
                                colors: ['#FDEB64', '#FED443', '#D4840E'], price: price}]);

                        }

                        setLoadWinners(false);


                    } catch (e) {
                        console.log(e);
                        setLoadWinners(false);
                    }

                }
            } else {
                if (chainId !== undefined) {
                    try {
                        const bidContract = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
                        const bidders = await bidContract.projID(id);

                        if (Number(bidders.toString()) > 2) {
                            const winnersList: string[] = await bidContract.Top3Bidders(id);
                            setTopBidders(winnersList);

                            winnerDetails[0].address = winnersList[0];
                            winnerDetails[1].address = winnersList[1];
                            winnerDetails[2].address = winnersList[2];

                            const bidData = await bidContract.request_data_in_Bidding(id);
                            setTotalBid(bidData.totalBidding.toString());

                            setRewardArray([ethers.utils.formatUnits(bidData.positionOneSharedPercentage.toString(),  18), ethers.utils.formatUnits(bidData.positionTwoSharedPercentage.toString(), 18),
                                ethers.utils.formatUnits(bidData.positionThreeSharedPercentage.toString(),  18), ethers.utils.formatUnits(bidData.randomUserSharedPercentage.toString(),  18)]);

                            const firstPrize = Number(setRewardArrayRef.current[0])/100 * Number(bidData.totalBidding.toString());
                            const secondPrize = Number(setRewardArrayRef.current[1])/100 * Number(bidData.totalBidding.toString());
                            const thirdPrize = Number(setRewardArrayRef.current[2])/100 * Number(bidData.totalBidding.toString());

                            winnerDetails[0].price = ethers.utils.formatUnits(firstPrize.toString(),  18);
                            winnerDetails[1].price = ethers.utils.formatUnits(secondPrize.toString(),  18);
                            winnerDetails[2].price = ethers.utils.formatUnits(thirdPrize.toString(),  18);
                        }
                        else {
                            const winnersInfo = await bidContract.getTopBid(id);

                            const bidData = await bidContract.request_data_in_Bidding(id);
                            setTotalBid(bidData.totalBidding.toString());

                            const percent = ethers.utils.formatUnits(bidData.positionOneSharedPercentage.toString(),  18);
                            const total = ethers.utils.formatUnits(bidData.totalBidding.toString(),  18);

                            const price = Number(percent)/100 * Number(total);

                            setWinnerDetails([{id: 1, address: winnersInfo[0],
                                colors: ['#FDEB64', '#FED443', '#D4840E'], price: price}]);
                        }

                        setLoadWinners(false);

                    } catch (e) {
                        console.log(e);
                        setLoadWinners(false);
                    }
                }
            }

        };
        fetchBidWinners();
    }, [ chainId, totalBid, id, stateChanged, account]);

    return {loadWinners, winnerDetails}
};


