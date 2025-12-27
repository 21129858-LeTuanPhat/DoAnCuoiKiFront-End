type RequestConnect = {
    createAt: number;
    username: string;
    imageUrl: string;
    status: ResponseStatus;
    type: 'people' | 'room';
};
export type ResponseStatus = 'pending' | 'accepted' | 'rejected' | 'connected' | 'canceled';

export default RequestConnect;
