import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { stat } from "fs"

interface UserInterface {
    username: string | null
    reCode: string | null
}

const initialUser: UserInterface = {
    username: null,
    reCode: null
}
const userReducer = createSlice({
    name: 'auth',
    initialState: initialUser,
    reducers: {
        userAction(state, action: PayloadAction<{ username: string, reCode: string }>) {
            state.username = action.payload.username
        },
        logOut(state) {
            state.username = null
        }

    }
})

export const { userAction, logOut } = userReducer.actions
export default userReducer.reducer



