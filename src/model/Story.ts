interface Story {
    id: string;
    imageUrl?: string;
    content: string;
    ownerAvatarUrl?: string;
    ownerUsername: string;
    createAt: number;
    expireAt: number;
    like: number;
    view: number;
    isLike?: boolean;
}

export default Story;
