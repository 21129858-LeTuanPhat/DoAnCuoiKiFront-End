export interface ChatMessage {
    id: number;
    name: string | null;
    type: number;
    to: string;
    mes: string;
    createAt: string;
}
