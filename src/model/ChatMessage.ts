export interface ChatMessage {
    id: number;
    name: string | null;
    type: number;
    to: string;
    mes: string;
    createAt: string;
}



export interface ISendMessage {
    type: number,
    payload: any
}

export enum TypeMess {
    SIGNAL_REQUEST = 10,
    SIGNAL_RESPONSE = 11,
}