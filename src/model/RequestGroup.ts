type RequestGroup = {
    username: string;
    imageUrl?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'connected' | 'canceled';
    createAt: Date;
};

export default RequestGroup;
