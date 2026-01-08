import { useEffect, useState } from 'react';
import { isLikeStory, LoadStoryFeed } from '../services/firebaseService';
import Story from '../model/Story';
import { db } from '../config/firebaseConfig';
import { ref, get } from 'firebase/database';

function useStories({ username }: { username: string }): Story[] {
    const [stories, setStories] = useState<Story[]>([]);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        const unsubscribe = LoadStoryFeed(username, async (storyId) => {
            const snap = await get(ref(db, `stories/${storyId}`));
            const story = snap.val();
            console.log('Loaded story:', story);
            const isLike = await isLikeStory(storyId, username);
            story.isLike = isLike;

            if (!story) return;

            setStories((prev) => [story, ...prev]);
        });

        return () => unsubscribe();
    }, []);

    return stories;
}

export default useStories;
