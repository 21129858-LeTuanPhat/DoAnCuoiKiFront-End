import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"
import WebSocketManager from "./socket/WebSocketManager"
import { RootState } from "./redux/store"
import { setReCode } from "./redux/userReducer"
import { SOCKET_BASE_URL } from "./config/utils"
export default
    function AuthGate() {
    const user = useSelector((s: RootState) => s.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [checkingAuth, setCheckingAuth] = useState(true)
    const ran = useRef(false)

    useEffect(() => {
        if (ran.current) return
        ran.current = true
        const username = localStorage.getItem('username')
        const reCode = localStorage.getItem('reCode')
        const ws = WebSocketManager.getInstance()

        if (user.username) {
            setCheckingAuth(false)
            return
        }
        if (!username || !reCode) {
            navigate('/login', { replace: true })
            setCheckingAuth(false)
            return
        }

        const handler = (msg: any) => {
            // Chỉ xử lý LOGIN/RE_LOGIN events, bỏ qua các event khác KHÔNG chặn
            if (!msg.event || (msg.event !== 'LOGIN' && msg.event !== 'RE_LOGIN')) {
                return  // Không log, không chặn - để handler khác xử lý
            }

            if (msg.status === 'error') {
                console.error('RE_LOGIN failed:', msg)
                localStorage.clear()
                navigate('/login', { replace: true })
                setCheckingAuth(false)
                return
            }

            if (msg.status === 'success') {
                // Lấy reCode từ response
                const newReCode = msg.data?.RE_LOGIN_CODE
                console.log('Extracted reCode:', newReCode)

                if (!newReCode) {
                    console.error('Invalid reCode received:', newReCode)
                    console.error('Full msg.data:', msg.data)
                    localStorage.clear()
                    navigate('/login', { replace: true })
                    setCheckingAuth(false)
                    return
                }

                console.log('RE_LOGIN success, updating state with:', {
                    reCode: newReCode,
                    username: username
                })
                dispatch(setReCode({
                    reCode: newReCode,
                    username: username
                }))
                setCheckingAuth(false)
            }
        }
        ws.onMessage('RE_LOGIN', handler)

        const performReLogin = async () => {
            try {
                await ws.connect2(SOCKET_BASE_URL)

                ws.sendMessage(JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'RE_LOGIN',
                        data: { user: username, code: reCode }
                    }
                }))
            } catch (error) {
                console.error('Lỗi khi kết nối WebSocket:', error)
                localStorage.clear()
                navigate('/login', { replace: true })
                setCheckingAuth(false)
            }
        }
        performReLogin()

        return () => ws.unSubcribe('RE_LOGIN')
    }, [])
    if (checkingAuth) {
        return <div>Đang kiểm tra xác thực...</div>
    }
    return <Outlet />
}
