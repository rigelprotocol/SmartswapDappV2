import {useEffect, useState} from "react";
import cardbid from "../../assets/smartbid/cardbid2.svg";
import {useActiveWeb3React} from "../../utils/hooks/useActiveWeb3React";
import {RigelSmartBid, RigelSmartBidTwo} from "../../utils/Contracts";
import {SMARTBID1, SMARTBID2} from "../../utils/addresses";
import {countDownDate} from "../../pages/SmartBid/Components/Card";
import bidNFT from "../../assets/smartbid/nftbid.svg";


export interface BidInterface {
    time: boolean,
    exclusive: boolean,
    image: string,
    title: string,
    id: number,
    text: string,
    color: string,
    bgColor: string
}

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

    const [bidItemsNFT, setBidItemsNFT] = useState<Array<BidInterface>>([]);
    const [bidLength, setBidLength] = useState<number>();
    const {chainId, library, account} = useActiveWeb3React();
    const [loadBid, setLoadBid] = useState<boolean>(false);

    useEffect(() => {
        const getSmartBidArray = async () => {
            try {
                setLoadBid(true);
                const bidContract = await RigelSmartBid(SMARTBID1[chainId as number], library);
                const item = await bidContract.bidLength();
                setBidLength(Number(item.toString()));

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


                const bidContractTwo = await RigelSmartBidTwo(SMARTBID2[chainId as number], library);
                const noNftLength = await bidContractTwo.bidLength();
                setBidLength(Number(noNftLength.toString()));

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
    }, [chainId]);

    return {loadBid, bidItemsNFT}
};