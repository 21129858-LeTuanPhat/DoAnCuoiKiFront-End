interface Story {
    id: string;
    imageUrl?: string;
    audioUrl?: string;
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
