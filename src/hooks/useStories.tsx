import { useEffect, useState } from 'react';
import { LoadStoryFeed } from '../services/firebaseService';
import Story from '../model/Story';

function useStories({ username }: { username: string }): [Story[], () => Promise<void>, boolean] {
    const [stories, setStories] = useState<Story[]>([]);
    const [lastTime, setLastTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    async function loadMore() {
        if (loading) return;
        setLoading(true);

        const listData = await LoadStoryFeed(username, lastTime || undefined);
        if (listData.length === 0) {
            setLoading(false);
            return;
        }
        const newStories = listData.slice().reverse();
        console.log('LOAD MORE STORIES: ', newStories);

        setStories((prev) => [...prev, ...newStories]);
        setLastTime(newStories[newStories.length - 1].createAt);

        setLoading(false);
    }
    useEffect(() => {
        loadMore();
    }, []);

    return [stories, loadMore, loading];
}

export default useStories;
