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
