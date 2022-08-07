import {useEffect, useState} from "react";
import cardbid from "../../assets/smartbid/cardbid2.svg";
import {useActiveWeb3React} from "../../utils/hooks/useActiveWeb3React";
import {RigelSmartBid, RigelSmartBidTwo} from "../../utils/Contracts";
import {SMARTBID1, SMARTBID2} from "../../utils/addresses";
import {countDownDate} from "../../pages/SmartBid/Components/Card";
import bidNFT from "../../assets/smartbid/nftbid.svg";
import {useSelector} from "react-redux";
import {RootState} from "../index";
import {useProvider} from "../../utils/utilsFunctions";
import gql from "graphql-tag";

export class BidStructure {
    time: boolean;
    exclusive: boolean;
    image: string;
    title: string;
    id: number;
    text: string;
    color: string;
    bgColor: string;

    constructor(time: boolean, exclusive: boolean, image: string, title: string, id: number, text: string, color: string, bgColor: string) {
        this.time = time;
        this.exclusive = exclusive;
        this.image = image;
        this.title = title;
        this.id = id;
        this.text = text;
        this.color = color;
        this.bgColor = bgColor;
    }
}

export const useBidInfo = () => {

    const [bidItemsNFT, setBidItemsNFT] = useState<Array<BidStructure>>([]);
    const {account, chainId, library} = useActiveWeb3React();
    const [loadBid, setLoadBid] = useState<boolean>(false);
    const ChainId = useSelector<RootState>((state) => state.chainId.chainId);
    const {prov} = useProvider();



    useEffect(() => {
        const lib = library ? library : prov;

        const getSmartBidArray = async () => {
            try {
                setLoadBid(true);
                setBidItemsNFT([]);
                const bidContract = await RigelSmartBid(SMARTBID1[ChainId as number], lib);
                const item = await bidContract.bidLength();

                for (let i = 0; i <= Number(item.toString()) - 1; i++) {
                    const bidData = await bidContract.request_data_in_Bidding(i);

                    const now = new Date().getTime();
                    const bidDate = countDownDate(Number(bidData.timeOut.toString()));

                    const bidDeadline = new Date(bidDate).getTime();
                    const eventEnded =  bidDeadline < now;

                    const newData =  new BidStructure(eventEnded, true, cardbid, 'NFT owners only',
                        i, 'Participants get .. of their winnings.',  '#F25F4C', '#FFF3F1');
                    setBidItemsNFT((prevState => [...prevState, newData]))
                }

                const bidContractTwo = await RigelSmartBidTwo(SMARTBID2[ChainId as number], lib);
                const noNftLength = await bidContractTwo.bidLength();

                for (let i = 0; i <= Number(noNftLength.toString()) - 1; i++) {
                    const bidData = await bidContractTwo.request_data_in_Bidding(i);

                    const now = new Date().getTime();
                    const bidDate = countDownDate(Number(bidData.timeOut.toString()));

                    const bidDeadline = new Date(bidDate).getTime();
                    const eventEnded =  bidDeadline < now;

                    const newData =  new BidStructure(eventEnded, false, bidNFT, 'Everyone',
                        i, 'NFT Owners get X2 of their winnings.',  '#EDE8FD', '#EDE8FD');
                    setBidItemsNFT((prevState => [...prevState, newData]))
                }

                setLoadBid(false);

            } catch (e) {
                console.log(e);
                setLoadBid(false);
            }
        };
        getSmartBidArray();
    }, [ChainId, account, library]);

    return {loadBid, bidItemsNFT}
};

export const GET_BIDS = gql`
    query FetchBids ($id: Int) {
        bids(first: 3, orderBy: createdAt, orderDirection: desc, where: {eventID: $id}) {
            address
            eventID
            stakedAmount
            createdAt
        }
    }
`;