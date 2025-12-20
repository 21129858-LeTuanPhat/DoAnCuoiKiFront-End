import { useContext } from 'react';
import { BoardContext } from '../components/chat/Context/BoardProvider';

export function useBoardContext() {
    const context = useContext(BoardContext);

    if (!context) {
        throw new Error('Must wrap with BoardProvider');
    }
    return context;
}
