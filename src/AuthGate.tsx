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

        // Nếu đã có user trong Redux, bỏ qua kiểm tra
        if (user.username) {
            setCheckingAuth(false)
            return
        }

        // Nếu không có thông tin trong localStorage, chuyển về login
        if (!username || !reCode) {
            navigate('/login', { replace: true })
            setCheckingAuth(false)
            return
        }

        // Xử lý response từ RE_LOGIN
        const handler = (msg: any) => {
            console.log('=== RE_LOGIN RESPONSE ===')
            console.log('Full message:', JSON.stringify(msg, null, 2))

            // Server có thể trả về event: "LOGIN" hoặc "RE_LOGIN" tùy trường hợp
            // Chỉ xử lý message có event là LOGIN hoặc RE_LOGIN
            if (msg.event && msg.event !== 'LOGIN' && msg.event !== 'RE_LOGIN') {
                console.log('Skipping event:', msg.event)
                return
            }

            if (msg.status === 'error') {
                // RE_LOGIN thất bại, xóa localStorage và chuyển về login
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

                // RE_LOGIN thành công, cập nhật Redux state với username và reCode mới
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

        // Đảm bảo WebSocket đã kết nối trước khi gửi RE_LOGIN
        const performReLogin = async () => {
            try {
                // Kết nối WebSocket nếu chưa kết nối
                await ws.connect2(SOCKET_BASE_URL)

                // Gửi request RE_LOGIN
                ws.sendMessage(JSON.stringify({
                    action: 'onchat',
                    data: {
                        event: 'RE_LOGIN',
                        data: { user: username, code: reCode }
                    }
                }))
            } catch (error) {
                console.error('Lỗi khi kết nối WebSocket:', error)
                // Nếu không kết nối được, chuyển về login
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
