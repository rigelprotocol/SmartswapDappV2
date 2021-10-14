import React, { useState, useEffect } from 'react';
import {

    Button,
    Heading,
    useDisclosure
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./../../components/ColorModeSwitcher";
import TransactionStateModal from "../../components/Modals/TransactionStateModal";
import { TrxState } from "../../components/Modals/TransactionStateModal";


const Test = () => {

    return (
        <div>


            <TransactionStateModal
                message={"Supplying 4.4311 RGP and 0.03434 USDT"}
                URLNetwork="google.com"
                typeOfModal={"Fail transaction modal"}
                trxState={TrxState.TransactionFailed} />

            <TransactionStateModal
                message={"Supplying 4.4311 RGP and 0.03434 USDT"}
                URLNetwork="google.com"
                typeOfModal={"transaction Success Modal"}
                trxState={TrxState.TransactionSuccessful} />

            <TransactionStateModal
                message={"Supplying 4.4311 RGP and 0.03434 USDT"}
                URLNetwork="google.com"
                typeOfModal={"Waiting comfirmation Modal"}
                trxState={TrxState.WaitingForConfirmation} />
        </div>
    )
}

export default Test
