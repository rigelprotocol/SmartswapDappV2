
import React, { useState } from "react"
import { useActiveWeb3React } from "../../utils/hooks/useActiveWeb3React"
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
    target: '.HeaderDApps',
    title: <TitleBox>DApps</TitleBox>,
    content: <ContentBox>This is the DApps dropdown, it is used to navigate to other DApps on RigelProtocol network</ContentBox>,
    placement: "left-start",
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },

  },

  {
    target: '.HeaderRide',
    title: <TitleBox>SmartSwap Products</TitleBox>,
    content: <ContentBox>These links lead to individual products under the RigelProtocol SmartSwap DApp.</ContentBox>,
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
    target: '.Network',
    title: <TitleBox>Network</TitleBox>,
    content: <ContentBox>This shows the networks supported by RigelProtocol so you can change to any of them by clicking on it.</ContentBox>,
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },
  },

  {
    target: '.Wallet',
    title: <TitleBox>Wallet</TitleBox>,
    content: <ContentBox>All details about wallet shows up here once you have connected it. You can connect your wallet by clicking here.</ContentBox>,
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },
  },


  {
    target: '.Token_Details',
    title: <TitleBox>Token Details</TitleBox>,
    content: <ContentBox>This shows details about the tokens about to be swapped. This widget can be compressed or closed completely.</ContentBox>,
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },
  }
  ,

  {
    target: '.History',
    title: <TitleBox>History</TitleBox>,
    content: <ContentBox>Here, you can check out your history after swapping. There are two views for this: Transaction History & Market History.</ContentBox>,
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },
  },
  {
    target: '.Swap',
    title: <TitleBox>Swap (1 of 4)</TitleBox>,
    content: <ContentBox>Welcome to the swap widget, this is where you swap your tokens.</ContentBox>,
    placement: "left",
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },
  },
  {
    target: '.FromToken',
    title: <TitleBox>Swap (2 of 4)</TitleBox>,
    content: <ContentBox>Here, you choose the tokens you would like to swap with.</ContentBox>,
    placement: "right",
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },
  },

  {
    target: '.SelectToken',
    title: <TitleBox>Swap (3 of 4)</TitleBox>,
    content: <ContentBox>Here, you choose the tokens you would like to receive.</ContentBox>,
    placement: "right",
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },
  },


  {
    target: '.SwapToken',
    title: <TitleBox>Swap (4 of 4)</TitleBox>,
    content: <ContentBox>You click this button to swap tokens after successfully connecting your wallet, choosing tokens and entering an amount.</ContentBox>,
    locale: {
      next: <NextBtn />,
      back: <BackBtn />,
      close: <CloseBtn />,
      last: <DoneBtn />,
      skip: <SkipBtn />

    },
  },

]
