import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserInterface {
    username: string | null
    reCode: string | null
}

const initialUser: UserInterface = {
    username: null,
    reCode: null,

}

const userReducer = createSlice({
    name: 'auth',
    initialState: initialUser,
    reducers: {
        userAction(state, action: PayloadAction<{ username: string, reCode: string }>) {
            state.username = action.payload.username
            state.reCode = action.payload.reCode
            console.log('recode login:', action.payload.reCode)

            localStorage.setItem('username', action.payload.username)
            localStorage.setItem('reCode', action.payload.reCode)
        },
        setReCode(state, action: PayloadAction<{ reCode: string, username?: string }>) {
            console.log('re code', action.payload.reCode)
            state.reCode = action.payload.reCode
            if (action.payload.username) {
                state.username = action.payload.username
                localStorage.setItem('username', action.payload.username)
            }
            localStorage.setItem('reCode', action.payload.reCode)
        },
        logOut(state) {
            state.username = null
            state.reCode = null

        }
    }
})

export const { userAction, logOut, setReCode } = userReducer.actions
export default userReducer.reducer