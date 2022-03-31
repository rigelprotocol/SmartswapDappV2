import { createReducer } from "@reduxjs/toolkit";
import {
    updateNftData
} from "./actions";

export interface nftStateInterface {
    loading: false,
    contents: Array<{
        nftName: string;
        priceUSD: number;
        priceRGP: number;
        image: string;
        id: number;
        number: string;
    }>;
}

export const initialState: nftStateInterface = {
    loading: false,
    contents: [
        {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png',
            id: 1,
            number: '17'
        }, {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png',
            id: 2,
            number: '42'
        }, {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png',
            id: 3,
            number: '67'
        },
        {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://academy-public.coinmarketcap.com/optimized-uploads/6baf17f9b6d84e6992c8d6f220a53d18.png',
            id: 4,
            number: '255'
        }, {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmU9hZqvWraVqFswx5Vpvo4jPQqWDC23GzyjdVv8K2CV5c/376.png',
            id: 5,
            number: '555'
        }, {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmekhK1GxzK8FF1hEFF1FuXeV27HLED1EFEPH9pPrDbG8v/676.png',
            id: 6,
            number: '1025'
        }, {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmWBk1xFWRbgArKUAZYgNSpnbk92KYaNP7GXTT1iNBGK8F/1176.png',
            id: 7,
            number: '1475'
        }, {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/Qmd2xDJjXQXMRdDx6mqsJTdruHF7M6fJNQerZcvLct38RA/1676.png',
            id: 8,
            number: '1975'
        },
        {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmdUakbhM4NdH59uwXdTB3tycFzubYfMMGpM8vYbkrAEpM/2176.png',
            id: 9,
            number: '2875'
        },
        {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmfLMPfyhTiT3fEQHbutmMQfDhZJeoHwWGGyftFZVndLBB/3176.png',
            id: 10,
            number: '3875'
        },
        {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmT2gWJUCEHvURf8zJcf5KXPL2ZVX2uRVTUSWnjHn5egNG/4176.png',
            id: 11,
            number: '4875'
        },
        {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmaETjBJmx2zgaJ5UFWoqV4pmsyGYrJiTUxg75bKQmZp1X/5176.png',
            id: 12,
            number: '5875'
        },
        {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmTCMs4m8EQ1YpYedCqLg7AcRUat37ckqdSCARydMKWgeZ/6176.png',
            id: 13,
            number: '6875'
        },
        {
            nftName: "NFT Name",
            priceUSD: 7500,
            priceRGP: 500.93,
            image: 'https://ipfs.io/ipfs/QmZEWagvtH4WkjKVwfbAgfRoGEKdojbxoVQHBX8BoRHwku/7176.png',
            id: 14,
            number: '7875'
        }
    ]
};

export default createReducer(initialState, (builder) =>
    builder
        // .addCase(updateNftData, (state, action) => {
        //     const idNumber = action.payload;
        //     let current = state.contents.findIndex((obj) => obj.id === idNumber);
        //
        //     if (current >= 0) {
        //         state.contents[current].totalLiquidity =
        //             parseInt(action.payload.value.reserves1) +
        //             parseInt(action.payload.value.reserves0);
        //     }
        // })

        .addCase(updateNftData, (state, action) => {
            const nftData = action.payload;

            nftData.forEach((item, id) => {
                state.contents[id].nftName = item.name;
                state.contents[id].image = item.image;
                state.contents[id].id = item.id;
            });
        })

        // .addCase(updatePoolId, (state, action) => {
        //     const poolIds = action.payload;
        //     poolIds.forEach((item, index) => {
        //         state.contents[index].pId = item;
        //     });
        // })
);