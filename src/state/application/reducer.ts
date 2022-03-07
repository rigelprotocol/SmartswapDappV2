import { createSlice } from '@reduxjs/toolkit'
import USDTLOGO from '../../assets/roundedlogo.svg';

export enum TrxState {
    WaitingForConfirmation,
    TransactionSubmitted,
    TransactionSuccessful,
    TransactionFailed,
}
interface IToken {
    id: number;
    img: string,
    name: string;
    type: string;
    display: boolean
}
export interface modalState {
    message?: string;
    trxState: TrxState;
    urlNetwork?: string;
    continue?: Function

}

type ModalState = {
    modal: modalState | null | undefined;
    tokenGroup: Array<IToken>,
    message?: string
};

const initialState: ModalState = {
    modal: null,
    message: "",
    tokenGroup: [{
        id: 1,
        img: USDTLOGO,
        name: "RigelProtocol Extended",
        type: "RigelProtocol Extended",
        display: true
    }, {
        id: 2,
        img: USDTLOGO,
        name: "RigelProtocol Extended",
        type: "RigelProtocol Token List",
        display: false
    }
    ]
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setOpenModal(state, action) {
            console.log(action.payload)
            state.modal = action.payload
        },
        setCloseModal(state) {
            state.modal = null
        },
        setTokenGroup(state, action) {
            state.tokenGroup = state.tokenGroup.map(obj => {
                if (action.payload.id === obj.id) {
                    return {
                        ...obj,
                        display: obj.display = action.payload.checked
                    }
                } else {
                    return obj
                }
            })
        },
    }
})

export const {
    setOpenModal,
    setCloseModal,
    setTokenGroup
} = applicationSlice.actions
export default applicationSlice.reducer