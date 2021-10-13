import React, { useState, useEffect } from 'react';
import {

    Button,
    Heading,
    useDisclosure
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./../../components/ColorModeSwitcher";
import TransactionStateModal from "../../components/Modals/TransactionStateModal";
import { TrxState } from "../../components/Modals/TransactionStateModal";

interface IState {
    trxWaiting: boolean;
    trxSuccess: boolean;
    trxFailed: boolean;
}

const Test = () => {


    const { isOpen, onOpen, onClose } = useDisclosure()



    const [waitIsopen, setwaitIsopen] = useState(false)

    const [successIsopen, setSuccessIsopen] = useState(false)

    const [failIsopen, setfailIsopen] = useState(false)






    return (
        <div>
            <Button variant="brand" onClick={() => setwaitIsopen(true)}> Show  Waiting Transaction </Button>
            {" "}
            <Button variant="brand" onClick={() => setSuccessIsopen(true)} > SHow Transaction Success </Button>

            {" "}
            <Button variant="brand" onClick={() => setfailIsopen(true)} > Show Transaction Fail </Button>

            <TransactionStateModal
                message={"Supplying 4.4311 RGP and 0.03434 USDT"}
                URLNetwork="google.com"
                trxState={TrxState.TransactionFailed} isOpen={failIsopen} onClose={onClose} />
            <TransactionStateModal
                message={"Supplying 4.4311 RGP and 0.03434 USDT"}
                URLNetwork="google.com"
                trxState={TrxState.TransactionSuccessful} isOpen={successIsopen} onClose={onClose} />
            <TransactionStateModal
                message={"Supplying 4.4311 RGP and 0.03434 USDT"}
                URLNetwork="google.com"
                trxState={TrxState.WaitingForConfirmation} isOpen={waitIsopen} onClose={onClose} />
        </div>
    )
}

export default Test
