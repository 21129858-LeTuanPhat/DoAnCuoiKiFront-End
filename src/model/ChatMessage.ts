export interface ChatMessage {
    id: number;
    name: string | null;
    type: number;
    to: string;
    mes: {
        type: number;
        data: string;
    };
    createAt: string;
}

export interface ISendMessage {
    type: number;
    payload: any;
}

export enum TypeMess {
    VIDEO_CALL = 30,
    VOICE_CALL = 40,
    LOCATION = 99,
    PIN = 77,
}
