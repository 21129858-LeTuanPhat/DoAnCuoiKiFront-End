type EventPayloadMap = {
    REGISTER: string;
    LOGOUT: string;
    LOGIN: { RE_LOGIN_CODE: string };
    RE_LOGIN: { RE_LOGIN_CODE: string };
};

type SuccessMessage<K extends keyof EventPayloadMap> = {
    status: 'success';
    event: K;
    data: EventPayloadMap[K];
};

type ErrorMessage = {
    status: 'error';
    event: string;
    mes: string;
};

export type WSMessage = SuccessMessage<keyof EventPayloadMap> | ErrorMessage;
