
import React, { useState } from "react"
import BackBtn from "./components/BackBtn"
import CloseBtn from "./components/CloseBtn"
import ContentBox from "./components/ContentBox"
import DoneBtn from "./components/DoneBtn"
import NextBtn from "./components/NextBtn"
import SkipBtn from "./components/SkipBtn"
import TitleBox from "./components/TitleBox"


export const tourSteps = [
    {
        target: '.Null',
        title: <TitleBox>Null</TitleBox>,
        content: "I purposely left this step empty"
    },
    {
        target: '.AddLiquidity',
        title: <TitleBox>Add Liquidity (1 of 3)</TitleBox>,
        content: <ContentBox>Here, you choose the tokens you would like to provide for liquidity.</ContentBox>,
        placement: "left-end",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn />

        },

    },

    {
        target: '.AddLiquidity2',
        title: <TitleBox>Add Liquidity (2 of 3)</TitleBox>,
        content: <ContentBox>Here, you choose the other equal token you would like to provide for liquidity.</ContentBox>,
        placement: "left-end",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn />

        },
    },

    {
        target: '.AddLiquidity3',
        title: <TitleBox>Add Liquidity (3 of 3)</TitleBox>,
        content: <ContentBox>You click this button to add tokens after successfully connecting your wallet, choosing tokens and entering an amount.</ContentBox>,
        placement: "left-end",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn />

        },
    },

    {
        target: '.Setting',
        title: <TitleBox>Setting</TitleBox>,
        content: <ContentBox>Here, you can set preferences to slippage tolerance, transaction deadline, etc.</ContentBox>,
        placement: "bottom",
        locale: {
            next: <NextBtn />,
            back: <BackBtn />,
            close: <CloseBtn />,
            last: <DoneBtn />,
            skip: <SkipBtn />

        },
    },


]
