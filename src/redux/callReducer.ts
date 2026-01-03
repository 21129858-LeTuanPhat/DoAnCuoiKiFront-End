import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CallStatus } from "../model/CallProps"
import { stat } from "fs"

export interface ReducerCall {
    callStatus: CallStatus,
    // true cuộc gọi đến, false cuộc gọi đi
    isIncoming?: boolean,
    type?: string,
    caller?: string | null,
    callMode?: number,
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
        incomingCall(state, action: PayloadAction<{ roomURL: string, roomID: string, caller: string | null, callMode: number, type: string }>) {
            console.log('trong reducer imcom ne')
            state.callStatus = CallStatus.RINGING
            state.isIncoming = true
            state.roomURL = action.payload.roomURL
            state.roomID = action.payload.roomID
            state.caller = action.payload.caller
            state.callMode = action.payload.callMode
            state.type = action.payload.type
        },
        outgoingCall(state, action: PayloadAction<{ roomURL: string, roomID: string, caller: string | null, callMode: number, type: string }>) {
            state.callStatus = CallStatus.CALLING
            state.isIncoming = false
            state.roomURL = action.payload.roomURL
            state.roomID = action.payload.roomID
            state.caller = action.payload.caller
            state.callMode = action.payload.callMode
            state.type = action.payload.type
        },

        updateStatus(state, action: PayloadAction<{ status: CallStatus }>) {
            state.callStatus = action.payload.status
        },
        resetCall() {
            return {
                callStatus: CallStatus.IDLE
            }
        }

    }
})
export default callReducer.reducer
export const { incomingCall, updateStatus, outgoingCall, resetCall } = callReducer.actions
