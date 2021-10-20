import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
    Button,
    Heading,
    useDisclosure
} from "@chakra-ui/react";
import { setOpenModal, TrxState } from '../../../state/application/reducer';
import {useDispatch} from "react-redux";


const Test = () => {
    const dispatch = useDispatch();
    return (
        <div>
            <Button onClick={() => {
                dispatch(setOpenModal({
                    message: "Sending 2RGP Token to Williams", trxState: TrxState.TransactionFailed
                }))
            }} variant="brand"> Dispatch Failed Trx state </Button>

<Button onClick={() => {
                dispatch(setOpenModal({
                    message: "Sending 2RGP Token to Williams", trxState: TrxState.WaitingForConfirmation
                }))
            }} variant="brand"> Dispatch waiting Trx state </Button>

<Button onClick={() => {
                dispatch(setOpenModal({
                    message: "Sending 2RGP Token to Williams", trxState: TrxState.TransactionSuccessful
                }))
            }} variant="brand"> Dispatch Successfull Trx state  </Button>


        </div>
    )
}

export default Test

