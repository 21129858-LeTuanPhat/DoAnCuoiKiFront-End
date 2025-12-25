type RequestConnect = {
    createAt: number;
    username: string;
    imageUrl: string;
    status: 'pending' | 'accepted' | 'rejected' | 'connected' | 'canceled';
};

export default RequestConnect;
