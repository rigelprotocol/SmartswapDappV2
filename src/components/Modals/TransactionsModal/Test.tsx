import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
    Button,
    Heading,
    useDisclosure
} from "@chakra-ui/react";
import TransactionStateModal, { TrxState } from './TransactionStateModal';
import { showModal } from './actions';

const mapDispatchToProps = {
    dispatchShowModal: showModal,
};
const connector = connect(undefined, mapDispatchToProps);

type AppProps = {} & ConnectedProps<typeof connector>;
const Test = (props: AppProps) => {
    const { dispatchShowModal } = props
    return (
        <div>
            <Button onClick={() => {
                dispatchShowModal({
                    message: "Sending 2RGP Token to Williams", trxState: TrxState.WaitingForConfirmation
                })
            }} variant="brand"> Dispatch waiting Trx state </Button>

            <Button onClick={() => {
                dispatchShowModal({
                    message: "Couldnt 2RGP Token to Williams", trxState: TrxState.TransactionFailed
                })
            }} variant="brand"> Dispatch Failed Transaction </Button>

            <Button onClick={() => {
                dispatchShowModal({
                    message: "Successfully sent 2RGP Token to Williams", urlNetwork:"https://etherscan.io/address/0x43b181891160414a092e5c363894a2329d2bb9fb", trxState: TrxState.TransactionSuccessful
                })
            }} variant="brand"> Dispatch Successfull Transaction </Button>


        </div>
    )
}

export default connector(Test) 

