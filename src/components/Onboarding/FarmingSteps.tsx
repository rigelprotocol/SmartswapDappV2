import React from "react"
import BackBtn from "./components/BackBtn"
import CloseBtn from "./components/CloseBtn"
import ContentBox from "./components/ContentBox"
import DoneBtn from "./components/DoneBtn"
import NextBtn from "./components/NextBtn"
import SkipBtn from "./components/SkipBtn"
import TitleBox from "./components/TitleBox"

const skipAllTours = ()=>{
    const visits = window.localStorage.getItem("firstFarmVisit");
    if (visits) {
      window.localStorage.setItem("firstFarmVisit", "2");
    }
}
export const steps = [
    {
        target: '.Null',
        title: <TitleBox>Null</TitleBox>,
        content: "I purposely left this step empty"
    },
    {
        target: '.liquidity',
        title: <TitleBox>Liquidity Pools</TitleBox>,
        content: <ContentBox>Here, you provide liquidity when you deposit tokens and earn interest rates on your capital.</ContentBox>,
        placement: "bottom",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn skipAllTours={skipAllTours}/>

        },

    },

    {
        target: '.staking',
        title: <TitleBox>Staking</TitleBox>,
        content: <ContentBox>Stake your cryptocurrency holdings and you get to earn passive income on your holdings.</ContentBox>,
        placement: "bottom",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn  skipAllTours={skipAllTours}/>

        },
    },

    {
        target: '.other',
        title: <TitleBox>Other Farms</TitleBox>,
        content: <ContentBox>This page displays other yield farms.</ContentBox>,
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn  skipAllTours={skipAllTours}/>

        },
    },

    {
        target: '.list',
        title: <TitleBox>List your project</TitleBox>,
        content: <ContentBox>You click here to list your Project on SmartSwap Farm.</ContentBox>,
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn  skipAllTours={skipAllTours}/>

        },
    },


    {
        target: '.unlock',
        title: <TitleBox>Liquidity Pool (1 of 3)</TitleBox>,
        content: <ContentBox>Welcome to the Liquidity Pool, to get started, click this button to unlock this liquidity pool. </ContentBox>,
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn  skipAllTours={skipAllTours}/>

        },
    }
];
