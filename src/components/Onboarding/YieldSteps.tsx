import React from "react"
import BackBtn from "./components/BackBtn"
import CloseBtn from "./components/CloseBtn"
import ContentBox from "./components/ContentBox"
import DoneBtn from "./components/DoneBtn"
import NextBtn from "./components/NextBtn"
import SkipBtn from "./components/SkipBtn"
import TitleBox from "./components/TitleBox"


export const steps = [
    {
        target: '.Null',
        title: <TitleBox>Null</TitleBox>,
        content: "I purposely left this step empty"
    },
    {
        target: '.approve',
        title: <TitleBox>Liquidity Pools (2 of 3)</TitleBox>,
        content: <ContentBox>Here, you approve the token of the liquidity pool through your wallet.</ContentBox>,
        placement: "bottom",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn />

        },

    },
    {
        target: '.unstake',
        title: <TitleBox>Unstake</TitleBox>,
        content: <ContentBox>You click here to unstake your tokens from the liquidity pool.</ContentBox>,
        placement: "bottom",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn />

        },

    },
    {
        target: '.deposit',
        title: <TitleBox>Liquidity Pools (3 of 3)</TitleBox>,
        content: <ContentBox>You click here to deposit your tokens on the liquidity pool.</ContentBox>,
        placement: "bottom",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn />

        },

    },

    {
        target: '.harvest',
        title: <TitleBox>Harvest</TitleBox>,
        content: <ContentBox>You click here to harvest the returns on your Crypto holdings.</ContentBox>,
        placement: "bottom",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn />

        }
    }
];
