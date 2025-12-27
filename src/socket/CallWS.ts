import { SOCKET_BASE_URL } from "../config/utils";
import WebSocketManager from "./WebSocketManager";

interface ICallSignal {
    type: string,
    roomID: string,
    status: string
}
export async function sendSignal(toUser: string, signal: ICallSignal) {
    const ws = WebSocketManager.getInstance();
    await ws.connect2(SOCKET_BASE_URL);
    ws.sendMessage(
        JSON.stringify(
            {
                action: "onchat",
                data: {
                    event: "SEND_CHAT",
                    data: {
                        type: "people",
                        to: toUser,
                        mes: JSON.stringify(signal)
                    }
                }
            }
        )
    );
}