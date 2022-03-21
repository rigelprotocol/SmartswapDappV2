
import React, { useState } from "react"
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React"
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
export const tourSteps = [
    {
        target: '.Null',
        title: <TitleBox>Null</TitleBox>,
        content: "I purposely left this step empty"
    },
    {
        target: '.Liquidity',
        title: <TitleBox>Liquidity</TitleBox>,
        content: <ContentBox>Welcome to the liquidity widget, this is where you join pools to receive tokens.</ContentBox>,
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
        target: '.AddLiquidity',
        title: <TitleBox>Liquidity</TitleBox>,
        content: <ContentBox>When you add liquidity, you will receive pool tokens representing your position.</ContentBox>,
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
        target: '.CreatePair',
        title: <TitleBox>Create a pair</TitleBox>,
        content: <ContentBox>If you don’t see a pair for your desired tokens, you can create one here.</ContentBox>,
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
        target: '.importPools',
        title: <TitleBox>Import Pools</TitleBox>,
        content: <ContentBox>You can import pools from your into the platform to continue funding it here.</ContentBox>,
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
        target: '.LiquidityPosition',
        title: <TitleBox>Liquidity Positions</TitleBox>,
        content: <ContentBox>You can check on your liquidity positions here..</ContentBox>,
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn skipAllTours={skipAllTours}/>

        },
    }

]
