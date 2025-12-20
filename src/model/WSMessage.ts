export interface WSMessage {
    status: 'success' | 'error';
    event: string;
    data: any;
}
