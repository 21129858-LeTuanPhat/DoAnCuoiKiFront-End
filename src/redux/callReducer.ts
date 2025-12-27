import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CallStatus } from "../model/CallProps"
import { stat } from "fs"

interface ReducerCall {
    callStatus: CallStatus,
    // true cuộc gọi đến, false cuộc gọi đi 
    isIncoming?: boolean,
    caller?: string | null,
    callMode?: string,
    roomID?: string,
    roomURL?: string,
}

const initialValue: ReducerCall = {
    callStatus: CallStatus.IDLE
}
const callReducer = createSlice({
    name: 'call',
    initialState: initialValue,
    reducers: {
        // cuộc gọi đến
        incomingCall(state, action: PayloadAction<{ roomURL: string, roomID: string, caller: string | null, callMode: string }>) {
            console.log('trong reducer imcom ne')
            state.callStatus = CallStatus.RINGING
            state.isIncoming = true
            state.roomURL = action.payload.roomURL
            state.roomID = action.payload.roomID
            state.caller = action.payload.caller
            state.callMode = action.payload.callMode
        },
        //cuộc gọi đi
        outGoingCall(state, action: PayloadAction<{ roomURL: string, roomID: string, caller: string | null }>) {
            state.callStatus = CallStatus.CALLING
            state.isIncoming = false
        },
        //trong cuộc gọi
        inCall(state) {
            state.callStatus = CallStatus.IN_CALL
        },
        cancelCall(state) {
            state.callStatus = CallStatus.IDLE
        }
    }
})
export default callReducer.reducer
export const { incomingCall, outGoingCall, inCall, cancelCall } = callReducer.actions
