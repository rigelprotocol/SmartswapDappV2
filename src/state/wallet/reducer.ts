import { createReducer } from "@reduxjs/toolkit";
import {openWalletConnection, closeWalletConnection} from "./actions"
interface ModalState {
    open:boolean
}

const initialState: ModalState = {
    open:false
}

export default createReducer<ModalState>(initialState,(builder)=>
builder.addCase(openWalletConnection,(state)=>{
    state.open = true
})
.addCase(closeWalletConnection,(state)=>{
    state.open = false
})
)